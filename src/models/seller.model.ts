import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    Unique,
    AllowNull,
    Default,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model.js';

@Table({
    tableName: 'sellers',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class Seller extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Unique
    @Column(DataType.INTEGER)
    userId: number;

    @BelongsTo(() => User)
    user?: User;

    @AllowNull(false)
    @Column({ type: DataType.STRING, field: 'business_name' })
    storeName: string;

    @Column(DataType.STRING)
    taxId: string | null;

    @AllowNull(false)
    @Column(DataType.STRING)
    iban: string;

    @Column(DataType.STRING)
    bankAccountOwner: string | null;

    @Column(DataType.STRING)
    bankName: string | null;

    @Column({ type: DataType.STRING, field: 'phone' })
    phoneNumber: string | null;

    @Default(5.00)
    @Column(DataType.DECIMAL(5, 2))
    commissionRate: number;

    @Default(false)
    @Column(DataType.BOOLEAN)
    isApproved: boolean;

    @Column(DataType.DATE)
    approvedAt: Date | null;

    // timestaps: 
    declare createdAt: Date;
    declare updatedAt: Date;
    declare deletedAt: Date;
}
