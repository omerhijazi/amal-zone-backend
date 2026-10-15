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

@Table({
    tableName: 'addresses',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class Address extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    userId: number | null;

    @BelongsTo(() => User)
    user?: User;

    @Column(DataType.STRING)
    title: string | null;

    @Column(DataType.STRING)
    addressLine1: string | null;

    @Column(DataType.STRING)
    addressLine2: string | null;

    @Column(DataType.STRING)
    country: string | null;

    @Column(DataType.STRING)
    city: string | null;

    @Column(DataType.STRING)
    postalCode: string | null;

    @Column(DataType.STRING)
    landmark: string | null;

    @Column(DataType.STRING)
    phoneNumber: string | null;

    // timestaps: 
    declare createdAt: Date;
    declare updatedAt: Date;
    declare deletedAt: Date;
}
