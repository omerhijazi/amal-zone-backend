import { IsOptional, IsInt, IsString, IsBoolean, Min, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProductQueryDto {
    @ApiPropertyOptional({
        example: 1,
        description: 'Page number for pagination',
        default: 1,
        minimum: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        example: 10,
        description: 'Number of items per page',
        default: 10,
        minimum: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @ApiPropertyOptional({
        example: 'cotton',
        description: 'Search keyword matching product title or description',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        example: 1,
        description: 'Filter products by category ID',
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    categoryId?: number;

    @ApiPropertyOptional({
        example: 10.0,
        description: 'Minimum price filter',
        minimum: 0,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @ApiPropertyOptional({
        example: 150.0,
        description: 'Maximum price filter',
        minimum: 0,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxPrice?: number;

    @ApiPropertyOptional({
        example: true,
        description: 'Filter only products that have available stock',
    })
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    inStock?: boolean;

    @ApiPropertyOptional({
        example: 'newest',
        description: 'Sort criteria for the product catalog',
        enum: ['price_asc', 'price_desc', 'newest', 'relevance'],
        default: 'newest',
    })
    @IsOptional()
    @IsString()
    sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'relevance' = 'newest';
}