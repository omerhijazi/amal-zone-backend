import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op, Transaction } from 'sequelize';
import { CheckoutDto } from './dto/checkout.dto.js';
import { OrderDetail } from '../../../models/order-detail.model.js';
import { OrderItem } from '../../../models/order-item.model.js';
import { ProductSku } from '../../../models/product-sku.model.js';
import { Product, ProductStatus } from '../../../models/product.model.js';
import { Cart } from '../../../models/cart.model.js';
import { CartItem } from '../../../models/cart-item.model.js';
import { Seller } from '../../../models/seller.model.js';
import { SellerPayout, PayoutStatus } from '../../../models/seller-payout.model.js';
import { PaymentDetail, PaymentStatus } from '../../../models/payment-detail.model.js';

@Injectable()
export class CustomerOrdersService {
    constructor(
        private readonly sequelize: Sequelize,
        @InjectModel(OrderDetail)
        private readonly orderDetailModel: typeof OrderDetail,
        @InjectModel(OrderItem)
        private readonly orderItemModel: typeof OrderItem,
        @InjectModel(ProductSku)
        private readonly productSkuModel: typeof ProductSku,
        @InjectModel(Product)
        private readonly productModel: typeof Product,
        @InjectModel(Cart)
        private readonly cartModel: typeof Cart,
        @InjectModel(CartItem)
        private readonly cartItemModel: typeof CartItem,
        @InjectModel(Seller)
        private readonly sellerModel: typeof Seller,
        @InjectModel(SellerPayout)
        private readonly sellerPayoutModel: typeof SellerPayout,
        @InjectModel(PaymentDetail)
        private readonly paymentDetailModel: typeof PaymentDetail,
    ) { }

    async checkout(userId: number, checkoutDto: CheckoutDto) {
        const t = await this.sequelize.transaction();

        try {
            // ==================
            // STEP 1: fetch cart
            // ==================
            const cart = await this.cartModel.findOne({
                where: { userId },
                include: [
                    {
                        model: CartItem,
                        as: 'items',
                        ...(checkoutDto.cartItemIds && checkoutDto.cartItemIds.length > 0
                            ? { where: { id: checkoutDto.cartItemIds } }
                            : {}),
                    },
                ],
                transaction: t,
            });

            if (!cart || !cart.items || cart.items.length === 0) {
                throw new BadRequestException('Cart is empty');
            }

            // ==========================================
            // STEP 2: lock SKUs and validate stock
            // ==========================================
            const lockedItemsData = [];

            for (const item of cart.items) {
                // lock the SKU row — no one else can modify it until transaction ends
                const sku = await this.productSkuModel.findOne({
                    where: { id: item.productSkuId },
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            required: true,
                            include: [{ model: Seller, as: 'seller', required: true }],
                        },
                    ],
                    lock: Transaction.LOCK.UPDATE,
                    transaction: t,
                });

                if (!sku) {
                    throw new BadRequestException(`SKU not found for item ${item.id}`);
                }

                if (sku.quantity < item.quantity) {
                    throw new BadRequestException(
                        `Insufficient stock for product: ${sku.product.name}. Available: ${sku.quantity}`,
                    );
                }

                const unitPrice = Number(sku.price);
                const lineTotal = unitPrice * item.quantity;

                lockedItemsData.push({
                    cartItem: item,
                    sku,
                    product: sku.product,
                    seller: sku.product.seller,
                    unitPrice,
                    lineTotal,
                });
            }

            // ==============================
            // STEP 3: create order_details
            // ==============================
            const orderTotal = lockedItemsData.reduce(
                (sum, item) => sum + item.lineTotal,
                0,
            );

            const order = await this.orderDetailModel.create(
                {
                    userId,
                    addressId: checkoutDto.shippingAddressId,
                    total: orderTotal,
                },
                { transaction: t },
            );

            // =====================================================
            // STEP 4 & 5: deduct stock + create order_item + payout
            // =====================================================
            for (const data of lockedItemsData) {
                const { sku, product, seller, cartItem, unitPrice, lineTotal } = data;

                // deduct stock
                const newQuantity = sku.quantity - cartItem.quantity;
                await sku.update(
                    { quantity: newQuantity },
                    { transaction: t },
                );

                // if quantity reached 0 you can add a status field update here
                // e.g. await sku.update({ quantity: newQuantity, status: 'out_of_stock' }, { transaction: t });

                // create order item — price stored historically
                const orderItem = await this.orderItemModel.create(
                    {
                        orderId: order.id,
                        productId: product.id,
                        productSkuId: sku.id,
                        sellerId: seller.id,
                        quantity: cartItem.quantity,
                        priceAtPurchase: unitPrice,
                    },
                    { transaction: t },
                );

                // create seller payout record
                if (seller) {
                    const commissionRate = Number(seller.commissionRate) || 5.0;
                    const commissionAmount = Math.round(((lineTotal * commissionRate) / 100) * 100) / 100;
                    const sellerEarning = Math.round((lineTotal - commissionAmount) * 100) / 100;

                    await this.sellerPayoutModel.create(
                        {
                            sellerId: seller.id,
                            orderItemId: orderItem.id,
                            totalAmount: lineTotal,
                            commissionAmount,
                            sellerEarning,
                            status: PayoutStatus.PENDING,
                        },
                        { transaction: t },
                    );
                }
            }

            // ================================
            // STEP 6: create payment_details
            // ================================
            await this.paymentDetailModel.create(
                {
                    orderId: order.id,
                    amount: orderTotal,
                    provider: checkoutDto.paymentProvider,
                    status: PaymentStatus.PENDING,
                },
                { transaction: t },
            );

            // ========================
            // STEP 7: clear selected cart items and recalculate cart total
            // ========================

            // destroy only the cart items that were part of this order
            const checkedOutItemIds = cart.items.map((i) => i.id);
            await this.cartItemModel.destroy({
                where: {
                    id: checkedOutItemIds,
                    cartId: cart.id,
                },
                transaction: t,
            });

            // fetch remaining cart items to recalculate total
            const remainingItems = await this.cartItemModel.findAll({
                where: { cartId: cart.id },
                include: [{ model: ProductSku, as: 'productSku' }],
                transaction: t,
            });

            const newCartTotal = remainingItems.reduce(
                (sum, item) => sum + (item.productSku ? Number(item.productSku.price) : 0) * (item.quantity || 1),
                0,
            );

            await cart.update({ total: Math.round(newCartTotal * 100) / 100 }, { transaction: t });


            // all good — commit
            await t.commit();

            return {
                message: 'Order placed successfully',
                orderId: order.id,
                total: orderTotal,
            };

        } catch (error) {
            // something went wrong — roll everything back
            await t.rollback();
            throw error;
        }
    }

    async findAllOrders(userId: number) {
        const orders = await this.orderDetailModel.findAll({
            where: {
                userId
            },
            include: [
                {
                    model: OrderItem,
                    as: 'orderItems',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                        },
                        {
                            model: ProductSku,
                            as: 'productSku',
                        },
                    ],
                },
            ],
        });

        if (!orders.length) {
            throw new BadRequestException('No orders found')
        }

        return orders;
    }

    async findOrderById(orderId: number, userId: number) {
        const order = await this.orderDetailModel.findOne({
            where: {
                id: orderId,
                userId
            },
            include: [
                {
                    model: OrderItem,
                    required: true,
                    as: 'orderItems',
                    include: [
                        {
                            model: Product,
                            required: true,
                            as: 'product'
                        },
                        {
                            model: ProductSku,
                            required: true,
                            as: 'productSku'
                        }
                    ]
                }
            ]
        })

        if (!order) {
            throw new BadRequestException('Order not found')
        }

        return order
    }

}