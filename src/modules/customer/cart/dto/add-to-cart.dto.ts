import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
    @ApiProperty({ example: 4, description: 'Product SKU ID' })
    @IsInt()
    @Min(1)
    productSkuId: number;

    @ApiProperty({ example: 1, description: 'Quantity to add', default: 1 })
    @IsInt()
    @Min(1)
    quantity: number = 1;
}