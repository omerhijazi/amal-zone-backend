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
import { Product } from './product.model.js';
import { ProductAttribute } from './product-attribute.model.js';

@Table({
    tableName: 'product_skus',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class ProductSku extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => Product)
    @Column({ type: DataType.INTEGER, field: 'product_id' })
    productId: number | null;

    @BelongsTo(() => Product, { foreignKey: 'product_id', as: 'product' })
    product?: any | null;

    @ForeignKey(() => ProductAttribute)
    @Column({ type: DataType.INTEGER, field: 'size_attribute_id' })
    sizeAttributeId: number | null;

    @BelongsTo(() => ProductAttribute, { foreignKey: 'size_attribute_id', as: 'sizeAttribute' })
    sizeAttribute?: ProductAttribute;

    @ForeignKey(() => ProductAttribute)
    @Column({ type: DataType.INTEGER, field: 'color_attribute_id' })
    colorAttributeId: number | null;

    @BelongsTo(() => ProductAttribute, { foreignKey: 'color_attribute_id', as: 'colorAttribute' })
    colorAttribute?: ProductAttribute;

    @Unique
    @Column(DataType.STRING)
    sku: string | null;

    @AllowNull(false)
    @Column(DataType.DECIMAL(10, 2))
    price: number;

    @Default(0)
    @Column(DataType.INTEGER)
    quantity: number;

    // timestaps: 
    declare createdAt: Date;
    declare updatedAt: Date;
    declare deletedAt: Date;
}
