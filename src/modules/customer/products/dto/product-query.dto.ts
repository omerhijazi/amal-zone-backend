import { IsOptional, IsInt, IsString, IsBoolean, Min, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ProductQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    categoryId?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxPrice?: number;

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    inStock?: boolean;

    @IsOptional()
    @IsString()
    sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'relevance' = 'newest';
}