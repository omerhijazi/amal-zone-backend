import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// models
import { Product } from '../../models/product.model.js';
import { ProductSku } from '../../models/product-sku.model.js';
import { ProductAttribute } from '../../models/product-attribute.model.js';
import { Category } from '../../models/category.model.js';
import { SubCategory } from '../../models/sub-category.model.js';
import { Cart } from '../../models/cart.model.js';
import { CartItem } from '../../models/cart-item.model.js';
import { OrderDetail } from '../../models/order-detail.model.js';
import { OrderItem } from '../../models/order-item.model.js';
import { Wishlist } from '../../models/wishlist.model.js';
import { User } from '../../models/user.model.js';
import { Seller } from '../../models/seller.model.js';
import { SellerPayout } from '../../models/seller-payout.model.js';
import { PaymentDetail } from '../../models/payment-detail.model.js';

// controllers
import { PartnerProductsController } from './products/partner-products.controller.js';

//services
import { PartnerProductsService } from './products/partner-products.service.js';

@Module({
    imports: [
        SequelizeModule.forFeature([
            Product,
            ProductSku,
            ProductAttribute,
            Category,
            SubCategory,
            Cart,
            CartItem,
            OrderDetail,
            OrderItem,
            Wishlist,
            User,
            Seller,
            SellerPayout,
            PaymentDetail,
        ]),
    ],
    controllers: [
        PartnerProductsController,
    ],
    providers: [
        PartnerProductsService,
    ],
})
export class PartnerModule { }


