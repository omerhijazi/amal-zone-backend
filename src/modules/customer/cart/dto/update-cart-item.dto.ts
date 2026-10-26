import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
    @ApiProperty({
        example: 2,
        description: 'New target quantity for the cart item (setting to 0 will remove the item from the cart)',
        minimum: 0,
    })
    @IsInt()
    @Min(0)
    quantity: number;
}
