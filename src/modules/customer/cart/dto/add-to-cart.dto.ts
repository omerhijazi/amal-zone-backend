import { IsOptional, IsInt, IsString, IsBoolean, Min, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class AddToCartDto {
    @IsInt()
    @Min(1)
    productId: number;

    @IsInt()
    @Min(1)
    productSkuId: number;

    @IsInt()
    @Min(1)
    quantity: number = 1;

}