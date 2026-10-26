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
    HasMany,
} from 'sequelize-typescript';
import { Seller } from './seller.model.js';
import { SubCategory } from './sub-category.model.js';
import { ProductSku } from './product-sku.model.js';

export enum ProductStatus {
    DRAFT = 'draft',
    PENDING_APPROVAL = 'pending_approval',
    PUBLISHED = 'published',
    REJECTED = 'rejected',
}

@Table({
    tableName: 'products',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class Product extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => Seller)
    @AllowNull(false)
    @Column({ type: DataType.INTEGER, field: 'seller_id' })
    sellerId: number;

    @BelongsTo(() => Seller, { foreignKey: 'seller_id', as: 'seller' })
    seller?: Seller;

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;

    @Column(DataType.TEXT)
    description: string | null;

    @Column(DataType.STRING)
    summary: string | null;

    @Column(DataType.STRING)
    cover: string | null;

    @ForeignKey(() => SubCategory)
    @Column({ type: DataType.INTEGER, field: 'category_id' })
    categoryId: number | null;

    @BelongsTo(() => SubCategory, { foreignKey: 'category_id', as: 'subCategory' })
    subCategory?: SubCategory;

    @HasMany(() => ProductSku, { foreignKey: 'product_id', as: 'skus' })
    skus?: ProductSku[];

    @Default(ProductStatus.DRAFT)
    @Column(DataType.ENUM(...Object.values(ProductStatus)))
    status: ProductStatus;

    // timestaps: 
    declare createdAt: Date;
    declare updatedAt: Date;
    declare deletedAt: Date;
}
