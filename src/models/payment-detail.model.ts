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
import { OrderDetail } from './order-detail.model.js';
import { Seller } from './seller.model.js';

export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

@Table({
    tableName: 'payment_details',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class PaymentDetail extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => Seller)
    @Column(DataType.INTEGER)
    sellerId: number | null;

    @BelongsTo(() => Seller)
    seller?: Seller;

    @ForeignKey(() => OrderDetail)
    @Column(DataType.INTEGER)
    orderId: number | null;

    @BelongsTo(() => OrderDetail)
    order?: OrderDetail;

    @Column(DataType.DECIMAL(10, 2))
    amount: number | null;

    @Column(DataType.STRING)
    provider: string | null;

    @Default(PaymentStatus.PENDING)
    @Column(DataType.ENUM(...Object.values(PaymentStatus)))
    status: PaymentStatus;

    // timestaps: 
    declare createdAt: Date;
    declare updatedAt: Date;
    declare deletedAt: Date;
}
