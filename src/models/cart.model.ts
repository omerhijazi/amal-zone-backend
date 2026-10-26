import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    Unique,
    Default,
    ForeignKey,
    BelongsTo,
    HasMany,
} from 'sequelize-typescript';
import { User } from './user.model.js';
import { CartItem } from './cart-item.model.js';

@Table({
    tableName: 'carts',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class Cart extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => User)
    @Unique
    @Column(DataType.INTEGER)
    userId: number | null;

    @BelongsTo(() => User)
    user?: User;

    @Default(0)
    @Column(DataType.DECIMAL(10, 2))
    total: number;

    @HasMany(() => CartItem, 'cartId')
    items?: CartItem[];

    // timestaps: 
    declare createdAt: Date;
    declare updatedAt: Date;
    declare deletedAt: Date;
}
