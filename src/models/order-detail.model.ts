import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model.js';

@Table({
    tableName: 'order_details',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class OrderDetail extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    userId: number | null;

    @BelongsTo(() => User)
    user?: User;

    @Column(DataType.INTEGER)
    paymentId: number | null;

    @AllowNull(false)
    @Column(DataType.DECIMAL(10, 2))
    total: number;

    // timestaps: 
    declare createdAt: Date;
    declare updatedAt: Date;
    declare deletedAt: Date;
}
