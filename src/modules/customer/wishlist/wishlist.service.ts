import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Wishlist } from '../../../models/wishlist.model.js';
import { Product, ProductStatus } from '../../../models/product.model.js';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto.js';

@Injectable()
export class WishlistService {
    constructor(
        @InjectModel(Wishlist)
        private readonly wishlistModel: typeof Wishlist,
        @InjectModel(Product)
        private readonly productModel: typeof Product,
    ) { }

    async getWishlist(userId: number) {
        return this.wishlistModel.findAll({
            where: { userId },
            include: [
                {
                    model: Product,
                    as: 'product'
                },
            ],
            order: [['created_at', 'DESC']],
        });
    }

    async addToWishlist(userId: number, dto: AddToWishlistDto) {
        const { productId } = dto;

        const product = await this.productModel.findByPk(productId);
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // if (product.status !== ProductStatus.PUBLISHED) {
        //     throw new BadRequestException('Product is not available for purchase');
        // }

        if (product.deletedAt) {
            throw new BadRequestException('Product is not available for purchase');
        }

        const [item, created] = await this.wishlistModel.findOrCreate({
            where: { userId, productId },
            defaults: { userId, productId },
        });

        const updatedWishlist = await this.getWishlist(userId);

        return {
            message: created
                ? 'Product added to wishlist successfully'
                : 'Product is already in wishlist',
            item,
            wishlist: updatedWishlist,
        };
    }

    async removeFromWishlist(userId: number, productId: number) {
        const item = await this.wishlistModel.findOne({
            where: {
                userId,
                [Op.or]: [{ productId }, { id: productId }],
            },
        });

        // FIXME: using [Op.or]: [{ productId }, { id: productId }] might cause it to delete the wrong item or two items
        // for now it's fine since we are only deleting one item at a time
        // but it's not a good practice

        if (!item) {
            throw new NotFoundException('Product not found in wishlist');
        }

        await item.destroy();

        const updatedWishlist = await this.getWishlist(userId);

        return {
            message: 'Product removed from wishlist successfully',
            wishlist: updatedWishlist,
        };
    }

    async clearWishlist(userId: number) {
        await this.wishlistModel.destroy({
            where: { userId },
        });

        return {
            message: 'Wishlist cleared successfully',
            wishlist: [],
        };
    }
}
