import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AddToCartDto } from './dto/add-to-cart.dto.js';
import { Cart } from '../../../models/cart.model.js';
import { CartItem } from '../../../models/cart-item.model.js';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart)
        private readonly cartModel: typeof Cart,
        @InjectModel(CartItem)
        private readonly cartItemModel: typeof CartItem,
    ) { }

    async addItemToCart(userId: number, query: AddToCartDto) {
        const { productId, productSkuId, quantity } = query;

        let cart = await this.cartModel.findOne({ where: { userId } });
        if (!cart) {
            cart = await this.cartModel.create({ userId });
        }
        const cartItem = await this.cartItemModel.findOne({ where: { cartId: cart.id, productId, productSkuId } });
        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            await this.cartItemModel.create({ cartId: cart.id, productId, productSkuId, quantity });
        }

        return { message: 'Item added to cart successfully' };
    }
}