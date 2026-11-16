import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    Default,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { OrderDetail } from './order-detail.model.js';
import { Product } from './product.model.js';
import { ProductSku } from './product-sku.model.js';
import { Seller } from './seller.model.js';

export enum OrderItemStatus {
    PENDING = 'pending',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

@Table({
    tableName: 'order_items',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class OrderItem extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => OrderDetail)
    @Column(DataType.INTEGER)
    orderId: number | null;

    @BelongsTo(() => OrderDetail)
    order?: any | null;

    @ForeignKey(() => Product)
    @Column(DataType.INTEGER)
    productId: number | null;

    @BelongsTo(() => Product)
    product?: Product;

    @ForeignKey(() => ProductSku)
    @Column({ type: DataType.INTEGER, field: 'product_sku_id' })
    productSkuId: number | null;

    @BelongsTo(() => ProductSku)
    productSku?: ProductSku;

    @Column(DataType.INTEGER)
    quantity: number | null;

    @AllowNull(false)
    @Column(DataType.DECIMAL(10, 2))
    priceAtPurchase: number;

    @ForeignKey(() => Seller)
    @Column(DataType.INTEGER)
    sellerId: number | null;

    @BelongsTo(() => Seller)
    seller?: Seller;

    @Default(OrderItemStatus.PENDING)
    @Column(DataType.ENUM(...Object.values(OrderItemStatus)))
    status: OrderItemStatus;

    // timestaps: 
    declare createdAt: Date;
    declare updatedAt: Date;
    declare deletedAt: Date;
}
