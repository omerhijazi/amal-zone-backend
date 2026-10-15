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
} from 'sequelize-typescript';
import { User } from './user.model.js';

@Table({
    tableName: 'cart',
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

    // timestaps: 
    declare createdAt: Date;
    declare updatedAt: Date;
    declare deletedAt: Date;
}
