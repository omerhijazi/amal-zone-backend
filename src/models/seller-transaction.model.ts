import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { Seller } from './seller.model.js';

export enum TransactionStatus {
    INITIATED = 'initiated',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

@Table({
    tableName: 'seller_transactions',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class SellerTransaction extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => Seller)
    @Column(DataType.INTEGER)
    sellerId: number | null;

    @BelongsTo(() => Seller)
    seller?: Seller;

    @Column(DataType.DECIMAL(10, 2))
    amount: number | null;

    @Column(DataType.STRING)
    ibanDestination: string | null;

    @Column(DataType.STRING)
    reference: string | null;

    @Column(DataType.ENUM(...Object.values(TransactionStatus)))
    status: TransactionStatus;

    @Column(DataType.DATE)
    initiatedAt: Date | null;

    @Column(DataType.DATE)
    completedAt: Date | null;

    // timestaps: 
    declare createdAt: Date;
    declare updatedAt: Date;
    declare deletedAt: Date;
}
