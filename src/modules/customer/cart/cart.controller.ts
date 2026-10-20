import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CartService } from './cart.service.js';
import { AddToCartDto } from './dto/add-to-cart.dto.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import type { JwtPayload } from '../../../common/types/jwt-payload.type.js';

@ApiTags('Customer - Cart')
@Controller('api/customer/cart')
@UseGuards(JwtAuthGuard)
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post()
    @ApiOperation({ summary: 'Add an item to the cart' })
    addItemToCart(
        @CurrentUser() user: JwtPayload,
        @Body() body: AddToCartDto,
    ) {
        return this.cartService.addItemToCart(user.userId, body);
    }
}