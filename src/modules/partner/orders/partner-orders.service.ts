import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderDetail } from '../../../models/order-detail.model.js';
import { OrderItem } from '../../../models/order-item.model.js';
import { Product } from '../../../models/product.model.js';
import { Seller } from '../../../models/seller.model.js';


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

    async getAllOrders(userId: number) {
        // get all order items sold by current seller then group them by order id 
    }

    async getOrderById(userId: number, orderId: number) {
        // get order items sold by current seller under the given order id 
    }
}