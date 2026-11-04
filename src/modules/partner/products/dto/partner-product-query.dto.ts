import { IsOptional, IsInt, IsString, IsBoolean, Min, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { PartialType, OmitType, PickType } from '@nestjs/mapped-types';

export class CreateProductSkuDto {
    @ApiProperty({
        example: 'TSHIRT-BLK-M',
        description: 'Unique SKU identifier code',
    })
    @IsString()
    @Type(() => String)
    sku: string;

    @ApiProperty({
        example: 29.99,
        description: 'Price of the product SKU',
    })
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price: number;

    @ApiPropertyOptional({
        example: 50,
        description: 'Stock quantity available for this SKU',
        default: 0,
    })
    @IsInt()
    @Min(0)
    @IsOptional()
    @Type(() => Number)
    quantity?: number;

    @ApiProperty({
        example: 2,
        description: 'Size attribute ID (foreign key to product_attributes)',
    })
    @IsInt()
    @Type(() => Number)
    sizeAttributeId: number;

    @ApiProperty({
        example: 5,
        description: 'Color attribute ID (foreign key to product_attributes)',
    })
    @IsInt()
    @Type(() => Number)
    colorAttributeId: number;
}

export class CreateProductDto {
    @ApiProperty({
        example: 'Cotton T-Shirt',
        description: 'Product Name',
        required: true,
    })
    @IsString()
    @Type(() => String)
    name: string;

    @ApiPropertyOptional({
        example: 'soft fabric cotton T-Shirt for every day use with unique patterns and different exciting colors',
        description: 'product description',
    })
    @IsString()
    @IsOptional()
    @Type(() => String)
    description?: string;

    @ApiPropertyOptional({
        example: 'soft fabric cotton T-Shirt for every day use',
        description: 'product summary',
    })
    @IsString()
    @IsOptional()
    @Type(() => String)
    summary?: string;

    @ApiPropertyOptional({
        example: 'https://example.com/product-main-image.jpg',
        description: 'product main image',
    })
    @IsString()
    @IsOptional()
    @Type(() => String)
    cover?: string;

    @ApiProperty({
        example: 12,
        description: 'product sub category id',
    })
    @IsInt()
    @Type(() => Number)
    categoryId: number;

    @ApiProperty({
        type: () => [CreateProductSkuDto],
        description: 'Array of product SKUs with price, stock, and attributes',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductSkuDto)
    skus: CreateProductSkuDto[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) { }

export class UpdateProductSkuDto {
    @ApiPropertyOptional({
        example: 29.99,
        description: 'Price of the product SKU',
    })
    @IsNumber()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    price?: number;

    @ApiPropertyOptional({
        example: 50,
        description: 'Stock quantity available for this SKU',
        default: 0,
    })
    @IsInt()
    @Min(0)
    @IsOptional()
    @Type(() => Number)
    quantity?: number;
}