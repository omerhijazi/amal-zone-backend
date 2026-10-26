import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service.js';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import type { JwtPayload } from '../../../common/types/jwt-payload.type.js';

@ApiTags('Customer - Wishlist')
@ApiBearerAuth()
@Controller('api/customer/wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) { }

    @Get()
    @ApiOperation({ summary: 'View current customer wishlist' })
    getWishlist(@CurrentUser() user: JwtPayload) {
        return this.wishlistService.getWishlist(user.userId);
    }

    @Delete()
    @ApiOperation({ summary: 'Clear all items from wishlist' })
    clearWishlist(@CurrentUser() user: JwtPayload) {
        return this.wishlistService.clearWishlist(user.userId);
    }

    @Post('products')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Add a product to wishlist' })
    addProduct(
        @CurrentUser() user: JwtPayload,
        @Body() body: AddToWishlistDto,
    ) {
        return this.wishlistService.addToWishlist(user.userId, body);
    }

    @Delete('products/:productId')
    @ApiOperation({ summary: 'Remove a product from wishlist' })
    removeProduct(
        @CurrentUser() user: JwtPayload,
        @Param('productId', ParseIntPipe) productId: number,
    ) {
        return this.wishlistService.removeFromWishlist(user.userId, productId);
    }
}
