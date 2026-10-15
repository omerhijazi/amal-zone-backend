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
import { Cart } from './cart.model.js';
import { Product } from './product.model.js';
import { ProductSku } from './product-sku.model.js';

@Table({
    tableName: 'cart_item',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class CartItem extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => Cart)
    @Column(DataType.INTEGER)
    cartId: number | null;

    @BelongsTo(() => Cart)
    cart?: Cart;

    @ForeignKey(() => Product)
    @Column(DataType.INTEGER)
    productId: number | null;

    @BelongsTo(() => Product)
    product?: Product;

    @ForeignKey(() => ProductSku)
    @Column(DataType.INTEGER)
    productsSkuId: number | null;

    @BelongsTo(() => ProductSku)
    productsSku?: ProductSku;

    @Default(1)
    @Column(DataType.INTEGER)
    quantity: number;

    // timestaps: 
    declare createdAt: Date;
    declare updatedAt: Date;
    declare deletedAt: Date;
}
