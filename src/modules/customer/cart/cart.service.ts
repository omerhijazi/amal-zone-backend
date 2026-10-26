import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from '../../../models/cart.model.js';
import { CartItem } from '../../../models/cart-item.model.js';
import { ProductSku } from '../../../models/product-sku.model.js';
import { Product, ProductStatus } from '../../../models/product.model.js';
import { ProductAttribute } from '../../../models/product-attribute.model.js';
import { AddToCartDto } from './dto/add-to-cart.dto.js';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart)
        private readonly cartModel: typeof Cart,
        @InjectModel(CartItem)
        private readonly cartItemModel: typeof CartItem,
        @InjectModel(ProductSku)
        private readonly productSkuModel: typeof ProductSku,
    ) { }

    async getCart(userId: number) {
        const [cart] = await this.cartModel.findOrCreate({
            where: { userId },
            defaults: { userId, total: 0 },
        });

        const fullCart = await this.cartModel.findByPk(cart.id, {
            include: [
                {
                    model: CartItem,
                    as: 'items',
                    include: [
                        {
                            model: ProductSku,
                            as: 'productSku',
                            include: [
                                {
                                    model: Product,
                                    as: 'product',
                                    attributes: ['id', 'name', 'cover', 'status'],
                                },
                                {
                                    model: ProductAttribute,
                                    as: 'sizeAttribute',
                                    attributes: ['id', 'value'],
                                },
                                {
                                    model: ProductAttribute,
                                    as: 'colorAttribute',
                                    attributes: ['id', 'value'],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        // Recalculate total to ensure accuracy
        const items = fullCart?.items || [];
        const total = items.reduce((sum, item) => {
            const price = item.productSku ? Number(item.productSku.price) : 0;
            return sum + price * (item.quantity || 1);
        }, 0);

        const roundedTotal = Math.round(total * 100) / 100;
        if (Number(cart.total) !== roundedTotal) {
            cart.total = roundedTotal;
            await cart.save();
            if (fullCart) {
                fullCart.total = roundedTotal;
            }
        }

        return fullCart;
    }

    async addItemToCart(userId: number, dto: AddToCartDto) {
        const { productSkuId, quantity = 1 } = dto;

        const sku = await this.productSkuModel.findByPk(productSkuId, {
            include: [{ model: Product, as: 'product' }],
        });

        if (!sku) {
            throw new NotFoundException('Product SKU not found');
        }

        if (sku.product?.status !== ProductStatus.PUBLISHED) {
            throw new BadRequestException('Product is not available for purchase');
        }

        const [cart] = await this.cartModel.findOrCreate({
            where: { userId },
            defaults: { userId, total: 0 },
        });

        const cartItem = await this.cartItemModel.findOne({
            where: {
                cartId: cart.id,
                productSkuId,
            },
        });

        const currentQuantity = cartItem ? cartItem.quantity : 0;
        const newQuantity = currentQuantity + quantity;

        if (newQuantity > sku.quantity) {
            throw new BadRequestException(
                `Cannot add ${quantity} item(s). Only ${sku.quantity} available in stock (${currentQuantity} already in cart).`,
            );
        }

        if (cartItem) {
            cartItem.quantity = newQuantity;
            await cartItem.save();
        } else {
            await this.cartItemModel.create({
                cartId: cart.id,
                productSkuId,
                quantity: newQuantity,
            });
        }

        return this.getCart(userId);
    }

    async updateItemQuantity(userId: number, itemId: number, quantity: number) {
        const cart = await this.cartModel.findOne({ where: { userId } });
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const cartItem = await this.cartItemModel.findOne({
            where: {
                id: itemId,
                cartId: cart.id,
            },
            include: [
                {
                    model: ProductSku,
                    as: 'productSku',
                    include: [{ model: Product, as: 'product' }],
                },
            ],
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        if (quantity <= 0) {
            await cartItem.destroy();
            return this.getCart(userId);
        }

        const sku = cartItem.productSku;
        if (!sku) {
            throw new NotFoundException('Product SKU not found');
        }

        if (sku.product?.status !== ProductStatus.PUBLISHED) {
            throw new BadRequestException('Product is not available for purchase');
        }

        if (quantity > sku.quantity) {
            throw new BadRequestException(
                `Cannot set quantity to ${quantity}. Only ${sku.quantity} available in stock.`,
            );
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        return this.getCart(userId);
    }

    async removeItemFromCart(userId: number, itemId: number) {
        const cart = await this.cartModel.findOne({ where: { userId } });
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const cartItem = await this.cartItemModel.findOne({
            where: {
                id: itemId,
                cartId: cart.id,
            },
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        await cartItem.destroy();

        const updatedCart = await this.getCart(userId);
        return {
            message: 'Item removed from cart successfully',
            cart: updatedCart,
        };
    }

    async clearCart(userId: number) {
        const cart = await this.cartModel.findOne({ where: { userId } });
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        await this.cartItemModel.destroy({
            where: { cartId: cart.id },
        });

        cart.total = 0;
        await cart.save();

        return this.getCart(userId);
    }
}