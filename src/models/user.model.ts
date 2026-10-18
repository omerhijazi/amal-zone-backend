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
} from 'sequelize-typescript';

export enum UserRole {
    CUSTOMER = 'customer',
    SELLER = 'seller',
    ADMIN = 'admin',
}

@Table({
    tableName: 'users',
    paranoid: true,
    timestamps: true,
    underscored: true,
})
export class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @Column(DataType.STRING)
    avatar: string | null;

    @AllowNull(false)
    @Column({ type: DataType.STRING })
    firstName: string;

    @Column({ type: DataType.STRING })
    lastName: string | null;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING)
    username: string;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING)
    email: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    password: string;

    @Column({ type: DataType.DATEONLY })
    dateOfBirth: string | null;

    @Column({ type: DataType.STRING })
    phoneNumber: string | null;

    @Default(UserRole.CUSTOMER)
    @Column(DataType.ENUM(...Object.values(UserRole)))
    role: UserRole;

    // timestaps: 
    declare createdAt: Date;
    declare updatedAt: Date;
    declare deletedAt: Date;

}