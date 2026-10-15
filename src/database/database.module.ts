import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '../config/database.config.js';
import { User } from '../models/user.model.js';
import { Category } from '../models/category.model.js';
import { SubCategory } from '../models/sub-category.model.js';
import { Product } from '../models/product.model.js';
import { ProductAttribute } from '../models/product-attribute.model.js';
import { ProductSku } from '../models/product-sku.model.js';
import { Cart } from '../models/cart.model.js';
import { CartItem } from '../models/cart-item.model.js';
import { OrderDetail } from '../models/order-detail.model.js';
import { OrderItem } from '../models/order-item.model.js';
import { PaymentDetail } from '../models/payment-detail.model.js';
import { Seller } from '../models/seller.model.js';
import { SellerPayout } from '../models/seller-payout.model.js';
import { SellerTransaction } from '../models/seller-transaction.model.js';
import { Address } from '../models/address.model.js';
import { Wishlist } from '../models/wishlist.model.js';

const models = [
    User,
    Category,
    SubCategory,
    Product,
    ProductAttribute,
    ProductSku,
    Cart,
    CartItem,
    OrderDetail,
    OrderItem,
    PaymentDetail,
    Seller,
    SellerPayout,
    SellerTransaction,
    Address,
    Wishlist
];


@Module({
    imports: [
        SequelizeModule.forRootAsync({
            imports: [ConfigModule.forFeature(databaseConfig)],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                dialect: 'postgres',
                host: config.get('database.host'),
                port: config.get<number>('database.port'),
                username: config.get('database.username'),
                password: config.get('database.password'),
                database: config.get('database.name'),
                models: models,
                autoSync: false,
                logging: process.env.NODE_ENV === 'development' ? console.log : false,
                pool: {
                    max: 10,
                    min: 0,
                    acquire: 30000,
                    idle: 10000,
                },
            }),
        }),
    ],
})
export class DatabaseModule { }