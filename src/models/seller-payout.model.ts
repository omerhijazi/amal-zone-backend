import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    Default,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { Seller } from './seller.model.js';
import { OrderItem } from './order-item.model.js';

export enum PayoutStatus {
    PENDING = 'pending',
    PAID = 'paid',
    CANCELLED = 'cancelled',
}

@Table({
    tableName: 'seller_payouts',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class SellerPayout extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => Seller)
    @Column(DataType.INTEGER)
    sellerId: number | null;

    @BelongsTo(() => Seller)
    seller?: Seller;

    @ForeignKey(() => OrderItem)
    @Column(DataType.INTEGER)
    orderItemId: number | null;

    @BelongsTo(() => OrderItem)
    orderItem?: OrderItem;

    @Column(DataType.DECIMAL(10, 2))
    totalAmount: number | null;

    @Column(DataType.DECIMAL(10, 2))
    commissionAmount: number | null;

    @Column(DataType.DECIMAL(10, 2))
    sellerEarning: number | null;

    @Default(PayoutStatus.PENDING)
    @Column(DataType.ENUM(...Object.values(PayoutStatus)))
    status: PayoutStatus;

    @Column(DataType.DATE)
    paidAt: Date | null;

    // timestaps: 
    declare createdAt: Date;
    declare updatedAt: Date;
    declare deletedAt: Date;
}
