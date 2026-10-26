import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
} from 'sequelize-typescript';

export enum ProductAttributeType {
    COLOR = 'color',
    SIZE = 'size',
}

@Table({
    tableName: 'product_attributes',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class ProductAttribute extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @Column({
        type: DataType.ENUM(...Object.values(ProductAttributeType)),
        field: 'product_attribute_type',
    })
    type: ProductAttributeType;

    @Column(DataType.STRING)
    value: string | null;

    // timestaps: 
    declare createdAt: Date;
    declare updatedAt: Date;
    declare deletedAt: Date;
}
