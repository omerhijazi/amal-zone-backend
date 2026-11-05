import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Product } from '../../../models/product.model.js';
import { ProductSku } from '../../../models/product-sku.model.js';
import { SubCategory } from '../../../models/sub-category.model.js';
import { Seller } from '../../../models/seller.model.js';
import { CreateProductDto, UpdateProductDto, CreateProductSkuDto, UpdateProductSkuDto } from './dto/partner-product-query.dto.js';

@Injectable()
export class PartnerProductsService {
    constructor(
        private readonly sequelize: Sequelize,
        @InjectModel(Product) private readonly productModel: typeof Product,
        @InjectModel(ProductSku) private readonly productSkuModel: typeof ProductSku,
        @InjectModel(SubCategory) private readonly subCategoryModel: typeof SubCategory,
        @InjectModel(Seller) private readonly sellerModel: typeof Seller,
    ) { }

    async validateSeller(userId: number) {
        const seller = await this.sellerModel.findOne({
            where: { userId: userId },
        });
        if (!seller) {
            throw new NotFoundException(`Seller not found with user id ${userId}`);
        }
        if (seller.isApproved === false) {
            throw new ForbiddenException(`Seller is not approved`);
        }
        return seller;
    }

    async getAllProducts(userId: number): Promise<Product[]> {
        const seller = await this.validateSeller(userId);
        const products = await this.productModel.findAll({ where: { sellerId: seller.id } });
        return products;
    }

    async getProduct(id: number, userId: number): Promise<Product> {
        const seller = await this.validateSeller(userId);
        const product = await this.productModel.findOne({
            where: { id, sellerId: seller.id },
            include: [{ model: this.productSkuModel, as: 'skus' }],
        });
        if (!product) {
            throw new NotFoundException(`Product not found`);
        }
        return product;
    }

    async createProduct(createProductDto: CreateProductDto, userId: number): Promise<Product> {
        const seller = await this.validateSeller(userId);
        const { name, description, summary, cover, categoryId, skus } = createProductDto;

        const subCategory = await this.subCategoryModel.findOne({
            where: { id: categoryId },
        });
        if (!subCategory) {
            throw new NotFoundException(`Sub-category with id ${categoryId} not found`);
        }
        return await this.sequelize.transaction(async (t) => {
            const product = await this.productModel.create({
                sellerId: seller.id,
                name,
                description,
                summary,
                cover,
                categoryId,
            },
                { transaction: t });

            const skusData = await this.productSkuModel.bulkCreate(
                skus.map((sku) => ({
                    sku: sku.sku,
                    price: sku.price,
                    quantity: sku.quantity,
                    productId: product.id,
                    sizeAttributeId: sku.sizeAttributeId,
                    colorAttributeId: sku.colorAttributeId,
                })),
                { transaction: t }
            );

            return await product.reload({
                include: [{ model: this.productSkuModel, as: 'skus' }],
                transaction: t
            });
        })
    }

    async updateProduct(id: number, updateProductDto: UpdateProductDto, userId: number): Promise<Product> {
        const seller = await this.validateSeller(userId);
        const product = await this.productModel.findOne({
            where: { id, sellerId: seller.id },
            include: [
                { model: this.productSkuModel, as: 'skus' }
            ],
        });

        if (!product) {
            throw new NotFoundException(`Product not found`);
        }

        if (updateProductDto.name) product.name = updateProductDto.name;
        if (updateProductDto.description) product.description = updateProductDto.description;
        if (updateProductDto.summary) product.summary = updateProductDto.summary;
        if (updateProductDto.cover) product.cover = updateProductDto.cover;
        if (updateProductDto.categoryId) product.categoryId = updateProductDto.categoryId;
        await product.save();
        return product;
    }

    async deleteProduct(id: number, userId: number): Promise<void> {
        const seller = await this.validateSeller(userId);
        const product = await this.productModel.findOne({
            where: { id, sellerId: seller.id },
        });
        if (!product) {
            throw new NotFoundException(`Product not found`);
        }
        await product.destroy();
    }

    // sku methods
    async getAllSkus(productId: number, userId: number): Promise<ProductSku[]> {
        const seller = await this.validateSeller(userId);
        const product = await this.productModel.findOne({
            where: { id: productId, sellerId: seller.id },
        });
        if (!product) {
            throw new NotFoundException(`Product not found`);
        }
        const skus = await this.productSkuModel.findAll({
            where: {
                productId
            },
        })
        return skus
    }

    async getSku(productId: number, skuId: number, userId: number): Promise<ProductSku> {
        const seller = await this.validateSeller(userId);
        const product = await this.productModel.findOne({
            where: { id: productId, sellerId: seller.id },
        });
        if (!product) {
            throw new NotFoundException(`Product not found`);
        }
        const sku = await this.productSkuModel.findOne({
            where: {
                productId,
                id: skuId
            },
        })
        if (!sku) throw new NotFoundException('no skus found')
        return sku
    }

    async addSkus(productId: number, userId: number, skus: CreateProductSkuDto[]): Promise<Product> {
        const seller = await this.validateSeller(userId);
        const product = await this.productModel.findOne({
            where: { id: productId, sellerId: seller.id },
        });
        if (!product) {
            throw new NotFoundException(`Product not found`);
        }
        return await this.sequelize.transaction(async (t) => {
            const skusData = await this.productSkuModel.bulkCreate(
                skus.map((sku) => ({
                    sku: sku.sku,
                    price: sku.price,
                    quantity: sku.quantity,
                    productId: product.id,
                    sizeAttributeId: sku.sizeAttributeId,
                    colorAttributeId: sku.colorAttributeId,
                })),
                { transaction: t }
            );
            return await product.reload({
                include: [{ model: this.productSkuModel, as: 'skus' }],
                transaction: t
            })
        })
    }

    async updateSku(skuId: number, productId: number, userId: number, updateProductSkuDto: UpdateProductSkuDto): Promise<ProductSku> {
        const seller = await this.validateSeller(userId)
        const product = await this.productModel.findOne({
            where: { id: productId, sellerId: seller.id },
        });
        if (!product) {
            throw new NotFoundException(`Product not found`);
        }
        const { quantity, price } = updateProductSkuDto
        const sku = await this.productSkuModel.findOne({
            where: { id: skuId, productId },
            include: [{
                model: this.productModel,
                as: 'product',
                required: true,
            }],
        })
        if (!sku) {
            throw new NotFoundException('Product SKU not found');
        }
        if (updateProductSkuDto.price !== undefined) sku.price = updateProductSkuDto.price
        if (updateProductSkuDto.quantity !== undefined) sku.quantity = updateProductSkuDto.quantity
        await sku.save()
        return sku
    }

    async deleteSku(productId: number, skuId: number, userId: number) {
        const seller = await this.validateSeller(userId)
        const sku = await this.productSkuModel.findOne({
            where: { id: skuId, productId },
            include: [{
                model: this.productModel,
                as: 'product',
                required: true,
            }],
        })
        if (!sku) {
            throw new NotFoundException('Product SKU not found');
        }
        if (!(sku.product.sellerId == seller.id)) {
            throw new ForbiddenException('Not allowed to delete this SKU')
        }
        await sku.destroy()
    }
}