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
import { User } from './user.model.js';
import { Product } from './product.model.js';

@Table({
    tableName: 'wishlists',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class Wishlist extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    userId: number | null;

    @BelongsTo(() => User)
    user?: User;

    @ForeignKey(() => Product)
    @Column(DataType.INTEGER)
    productId: number | null;

    @BelongsTo(() => Product)
    product?: Product;

    // timestaps: 
    declare createdAt: Date;
    declare updatedAt: Date;
    declare deletedAt: Date;
}
