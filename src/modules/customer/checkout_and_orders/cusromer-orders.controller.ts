import { Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerOrdersService } from './customer-orders.service.js';
import { CheckoutDto } from './dto/checkout.dto.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import type { JwtPayload } from '../../../common/types/jwt-payload.type.js';

@ApiTags('Customer - Orders')
@ApiBearerAuth()
@Controller('api/customer/orders')
@UseGuards(JwtAuthGuard)
export class CustomerOrdersController {
    constructor(private readonly customerOrdersService: CustomerOrdersService) { }

    @Post('checkout')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Checkout selected items from cart and create order' })
    checkout(
        @CurrentUser() user: JwtPayload,
        @Body() checkoutDto: CheckoutDto,
    ) {
        return this.customerOrdersService.checkout(user.userId, checkoutDto);
    }

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'get all orders' })
    getAllOrders(
        @CurrentUser() user: JwtPayload,
    ) {
        return this.customerOrdersService.findAllOrders(user.userId);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'get order by id' })
    getOrderById(
        @CurrentUser() user: JwtPayload,
        @Param('id') orderId: number,
    ) {
        return this.customerOrdersService.findOrderById(orderId, user.userId)
    }

}