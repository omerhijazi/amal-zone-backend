import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToWishlistDto {
    @ApiProperty({
        example: 1,
        description: 'Product ID to add to wishlist',
    })
    @IsInt()
    @Min(1)
    productId: number;
}
