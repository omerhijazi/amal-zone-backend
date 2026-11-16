import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import type { JwtPayload } from '../../../common/types/jwt-payload.type.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { Roles } from '../../../common/decorators/roles.decorator.js';
import { UserRole } from '../../../models/user.model.js';
import { PartnerOrdersService } from './partner-orders.service.js';

@ApiTags('Partner - Orders')
@ApiBearerAuth()
@Controller('api/partner/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SELLER)

export class PartnerOrdersController {
    constructor(
        private readonly partnerOrdersService: PartnerOrdersService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'get all orders sold by current seller' })
    getAllOrders(
        @CurrentUser() user: JwtPayload
    ) {
        return this.partnerOrdersService.getAllOrders(user.userId);
    }

    @Get(':orderId')
    @ApiOperation({ summary: 'get order details sold by current seller' })
    getOrderById(
        @CurrentUser() user: JwtPayload,
        @Param('orderId', ParseIntPipe) orderId: number
    ) {
        return this.partnerOrdersService.getOrderById(user.userId, orderId);
    }
}