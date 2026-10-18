import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CustomerProductsService } from './customer-products.service.js';
import { ProductQueryDto } from './dto/product-query.dto.js';

@ApiTags('Customer - Products')
@Controller('api/customer/products')
export class CustomerProductsController {
    constructor(private readonly productsService: CustomerProductsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all published products with filters and pagination' })
    findAll(@Query() query: ProductQueryDto) {
        return this.productsService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single product with all SKUs' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.findOne(id);
    }
}