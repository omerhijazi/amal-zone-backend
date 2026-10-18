import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Product } from '../../../models/product.model.js';
import { ProductSku } from '../../../models/product-sku.model.js';
import { ProductAttribute } from '../../../models/product-attribute.model.js';
import { SubCategory } from '../../../models/sub-category.model.js';
import { Category } from '../../../models/category.model.js';
import { ProductQueryDto } from './dto/product-query.dto.js';

@Injectable()
export class CustomerProductsService {
    constructor(
        @InjectModel(Product) private readonly productModel: typeof Product,
    ) { }

    async findAll(query: ProductQueryDto) {
        const {
            page,
            limit,
            search,
            categoryId,
            minPrice,
            maxPrice,
            inStock,
            sortBy,
        } = query;

        // const offset = (page - 1) * limit;

        // build where clause for product
        const productWhere: any = {
            status: 'published',
        };

        if (search) {
            productWhere.name = { [Op.iLike]: `%${search}%` };
        }

        if (categoryId) {
            productWhere.categoryId = categoryId;
        }

        // build where clause for SKU
        const skuWhere: any = {};

        if (minPrice !== undefined || maxPrice !== undefined) {
            skuWhere.price = {};
            if (minPrice !== undefined) skuWhere.price[Op.gte] = minPrice;
            if (maxPrice !== undefined) skuWhere.price[Op.lte] = maxPrice;
        }

        if (inStock) {
            skuWhere.quantity = { [Op.gt]: 0 };
        }

        // build order clause
        const order: any = [];
        if (sortBy === 'price_asc') order.push([{ model: ProductSku, as: 'skus' }, 'price', 'ASC']);
        else if (sortBy === 'price_desc') order.push([{ model: ProductSku, as: 'skus' }, 'price', 'DESC']);
        else order.push(['created_at', 'DESC']); // newest (default)

        const { rows, count } = await this.productModel.findAndCountAll({
            where: productWhere,
            include: [
                {
                    model: ProductSku,
                    as: 'skus',
                    where: Object.keys(skuWhere).length ? skuWhere : undefined,
                    required: Object.keys(skuWhere).length > 0, // inner join only if filters applied
                },
                {
                    model: SubCategory,
                    as: 'subCategory',
                    include: [{ model: Category, as: 'category' }],
                },
            ],
            order,
            limit,
            // offset,
            distinct: true, // 👈 needed for correct count with associations
        });

        return {
            data: rows,
            meta: {
                total: count,
                page,
                limit,
                // totalPages: Math.ceil(count / limit),
            },
        };
    }

    async findOne(id: number) {
        const product = await this.productModel.findOne({
            where: { id, status: 'published' },
            include: [
                {
                    model: ProductSku,
                    as: 'skus',
                    include: [
                        { model: ProductAttribute, as: 'sizeAttribute' },
                        { model: ProductAttribute, as: 'colorAttribute' },
                    ],
                },
                {
                    model: SubCategory,
                    as: 'subCategory',
                    include: [{ model: Category, as: 'category' }],
                },
            ],
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }
}

// FIXME: add pagination it is already added but not correctly and is commented out on line 85 and offset on line 84