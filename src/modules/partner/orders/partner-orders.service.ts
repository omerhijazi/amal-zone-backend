import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderDetail } from '../../../models/order-detail.model.js';
import { OrderItem, OrderItemStatus } from '../../../models/order-item.model.js';
import { Product } from '../../../models/product.model.js';
import { ProductSku } from '../../../models/product-sku.model.js';
import { ProductAttribute } from '../../../models/product-attribute.model.js';
import { Seller } from '../../../models/seller.model.js';
import { User } from '../../../models/user.model.js';

@Injectable()
export class PartnerOrdersService {
    constructor(
        @InjectModel(OrderDetail)
        private readonly orderDetailModel: typeof OrderDetail,
        @InjectModel(OrderItem)
        private readonly orderItemModel: typeof OrderItem,
        @InjectModel(Seller)
        private readonly sellerModel: typeof Seller,
        @InjectModel(Product)
        private readonly productModel: typeof Product,
    ) { }

    async validateSeller(userId: number) {
        const seller = await this.sellerModel.findOne({
            where: { userId: userId },
        });
        if (!seller) {
            throw new NotFoundException(`Seller not found with user id ${userId}`);
        }
        if (seller.isApproved === false) {
            throw new ForbiddenException(`Seller is not approved`);
        }
        return seller;
    }

    private getOrderIncludes(sellerId: number) {
        const includes: any[] = [
            {
                model: User,
                as: 'user',
                attributes: ['firstName', 'lastName', 'phoneNumber'],
            },
            {
                model: OrderItem,
                as: 'orderItems',
                required: true,
                where: { sellerId },
                attributes: [
                    'id',
                    'orderId',
                    'productId',
                    'productSkuId',
                    'quantity',
                    'priceAtPurchase',
                    'sellerId',
                    'status',
                    'createdAt',
                ],
                include: [
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'name', 'cover'],
                    },
                    {
                        model: ProductSku,
                        as: 'productSku',
                        attributes: ['id', 'sku', 'price', 'sizeAttributeId', 'colorAttributeId'],
                        include: [
                            {
                                model: ProductAttribute,
                                as: 'sizeAttribute',
                                attributes: ['id', 'type', 'value'],
                            },
                            {
                                model: ProductAttribute,
                                as: 'colorAttribute',
                                attributes: ['id', 'type', 'value'],
                            },
                        ],
                    },
                ],
            },
        ];

        const addressAssociation =
            OrderDetail.associations?.['address'] ||
            OrderDetail.associations?.['shippingAddress'] ||
            OrderDetail.associations?.['deliveryAddress'];

        if (addressAssociation) {
            includes.push({
                association: addressAssociation,
                attributes: ['id', 'addressLine1', 'addressLine2', 'city', 'country', 'postalCode', 'phoneNumber', 'landmark'],
            });
        }

        return includes;
    }

    private formatOrder(order: OrderDetail) {
        const plainOrder = order.get({ plain: true }) as any;
        delete plainOrder.total;

        const items = plainOrder.orderItems || [];
        const sellerSubtotal = items.reduce((sum: number, item: any) => {
            if (item.status === OrderItemStatus.CANCELLED || item.status === 'cancelled') {
                return sum;
            }
            const price = Number(item.priceAtPurchase) || 0;
            const qty = Number(item.quantity) || 0;
            return sum + price * qty;
        }, 0);

        plainOrder.sellerSubtotal = Math.round(sellerSubtotal * 100) / 100;
        return plainOrder;
    }

    async getAllOrders(userId: number) {
        const seller = await this.validateSeller(userId);
        const orders = await this.orderDetailModel.findAll({
            distinct: true,
            attributes: ['id', 'userId', 'paymentId', 'createdAt', 'updatedAt'],
            order: [['created_at', 'DESC']],
            include: this.getOrderIncludes(seller.id),
        } as any);

        return orders.map((order) => this.formatOrder(order));
    }

    async getOrderById(userId: number, orderId: number) {
        const seller = await this.validateSeller(userId);
        const order = await this.orderDetailModel.findOne({
            where: { id: orderId },
            attributes: ['id', 'userId', 'paymentId', 'createdAt', 'updatedAt'],
            include: this.getOrderIncludes(seller.id),
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return this.formatOrder(order);
    }
}