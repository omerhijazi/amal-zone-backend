import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../../common/decorators/current-user.decorator.js';
import type { JwtPayload } from '../../../common/types/jwt-payload.type.js';
import { PartnerProductsService } from './partner-products.service.js';
import { CreateProductDto, UpdateProductDto, CreateProductSkuDto, UpdateProductSkuDto } from './dto/partner-product-query.dto.js';

@ApiTags('Partner - Products')
@ApiBearerAuth()
@Controller('api/partner/products')
@UseGuards(JwtAuthGuard)
export class PartnerProductsController {
    constructor(private readonly productsService: PartnerProductsService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all products' })
    getAllProducts(
        @CurrentUser() user: JwtPayload,
    ) {
        return this.productsService.getAllProducts(user.userId);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get a product' })
    getProduct(
        @CurrentUser() user: JwtPayload,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.productsService.getProduct(id, user.userId);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Create a new product' })
    createProduct(
        @CurrentUser() user: JwtPayload,
        @Body() body: CreateProductDto,
    ) {
        return this.productsService.createProduct(body, user.userId);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update a product' })
    updateProduct(
        @CurrentUser() user: JwtPayload,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateProductDto,
    ) {
        return this.productsService.updateProduct(id, body, user.userId);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a product' })
    deleteProduct(
        @CurrentUser() user: JwtPayload,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.productsService.deleteProduct(id, user.userId);
    }

    // sku methods
    @Get(':id/skus')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'get all skus' })
    getAllSkus(
        @CurrentUser() user: JwtPayload,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.productsService.getAllSkus
    }

    @Get(':id/skus/:skuId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'get sku by id' })
    getSkuById(
        @CurrentUser() user: JwtPayload,
        @Param('id', ParseIntPipe) id: number,
        @Param('skuId', ParseIntPipe) skuId: number,

    ) {
        return this.productsService.getSku
    }

    @Post(':id/skus')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'add sku to a product' })
    upsertSku(
        @CurrentUser() user: JwtPayload,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: CreateProductSkuDto
    ) {
        return this.productsService.upsertSkus
    }

    @Patch(':id/skus/:skuId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'update an sku\'s price or quantity' })
    updateSku(
        @CurrentUser() user: JwtPayload,
        @Param('id', ParseIntPipe) id: number,
        @Param('skuId', ParseIntPipe) skuId: number,
        @Body() body: UpdateProductSkuDto
    ) {
        return this.productsService.updateSku
    }

    @Delete(':id/skus/:skuId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'delete an sku' })
    deleteSku(
        @CurrentUser() user: JwtPayload,
        @Param('id', ParseIntPipe) id: number,
        @Param('skuId', ParseIntPipe) skuId: number,
    ) {
        return this.productsService.deleteSku
    }

}