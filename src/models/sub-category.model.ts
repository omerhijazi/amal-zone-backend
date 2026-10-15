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
import { Category } from './category.model.js';

@Table({
    tableName: 'sub_categories',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class SubCategory extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => Category)
    @Column(DataType.INTEGER)
    parentId: number | null;

    @BelongsTo(() => Category)
    parentCategory?: Category;

    @Column(DataType.STRING)
    name: string | null;

    @Column(DataType.STRING)
    description: string | null;

    // timestaps: 
    declare createdAt: Date;
    declare updatedAt: Date;
    declare deletedAt: Date;
}
