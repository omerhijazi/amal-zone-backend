import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CheckoutDto {
    @ApiPropertyOptional({
        example: [1, 2],
        description: 'Array of CartItem IDs selected for checkout. If omitted or empty, all items currently in the cart will be checked out.',
        type: [Number],
    })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @Min(1, { each: true })
    cartItemIds?: number[];

    @ApiPropertyOptional({
        example: 1,
        description: 'Optional ID of the selected delivery/shipping address',
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    shippingAddressId?: number;

    @ApiPropertyOptional({
        example: 'credit_card',
        description: 'Payment provider or payment method (e.g. credit_card, cod, apple_pay)',
        default: 'credit_card',
    })
    @IsOptional()
    @IsString()
    paymentProvider?: string;
}