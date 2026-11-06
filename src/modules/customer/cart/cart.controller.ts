import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service.js';
import { AddToCartDto } from './dto/add-to-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import type { JwtPayload } from '../../../common/types/jwt-payload.type.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { Roles } from '../../../common/decorators/roles.decorator.js';
import { UserRole } from '../../../models/user.model.js';

@ApiTags('Customer - Cart')
@ApiBearerAuth()
@Controller('api/customer/cart')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    @ApiOperation({ summary: 'View current customer shopping cart' })
    getCart(@CurrentUser() user: JwtPayload) {
        return this.cartService.getCart(user.userId);
    }

    @Delete()
    @ApiOperation({ summary: 'Clear all items from shopping cart' })
    clearCart(@CurrentUser() user: JwtPayload) {
        return this.cartService.clearCart(user.userId);
    }

    @Post('items')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Add an item to the shopping cart (or increment if already added)' })
    addItemToCart(
        @CurrentUser() user: JwtPayload,
        @Body() body: AddToCartDto,
    ) {
        return this.cartService.addItemToCart(user.userId, body);
    }

    @Patch('items/:itemId')
    @ApiOperation({ summary: 'Update item quantity in cart (set to 0 to remove)' })
    updateQuantity(
        @CurrentUser() user: JwtPayload,
        @Param('itemId', ParseIntPipe) itemId: number,
        @Body() body: UpdateCartItemDto,
    ) {
        return this.cartService.updateItemQuantity(user.userId, itemId, body.quantity);
    }

    @Delete('items/:itemId')
    @ApiOperation({ summary: 'Remove an item from the shopping cart' })
    removeItem(
        @CurrentUser() user: JwtPayload,
        @Param('itemId', ParseIntPipe) itemId: number,
    ) {
        return this.cartService.removeItemFromCart(user.userId, itemId);
    }
}