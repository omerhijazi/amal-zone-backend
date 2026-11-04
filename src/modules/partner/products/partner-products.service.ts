import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction, where } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Product } from '../../../models/product.model.js';
import { ProductSku } from '../../../models/product-sku.model.js';
import { ProductAttribute } from '../../../models/product-attribute.model.js';
import { SubCategory } from '../../../models/sub-category.model.js';
import { Category } from '../../../models/category.model.js';
import { Seller } from '../../../models/seller.model.js';
import { User } from '../../../models/user.model.js';
import { CreateProductDto, UpdateProductDto, CreateProductSkuDto, UpdateProductSkuDto } from './dto/partner-product-query.dto.js';

@Injectable()
export class PartnerProductsService {
    constructor(
        private readonly sequelize: Sequelize,
        @InjectModel(Product) private readonly productModel: typeof Product,
        @InjectModel(ProductSku) private readonly productSkuModel: typeof ProductSku,
        @InjectModel(ProductAttribute) private readonly productAttributeModel: typeof ProductAttribute,
        @InjectModel(SubCategory) private readonly subCategoryModel: typeof SubCategory,
        @InjectModel(Category) private readonly categoryModel: typeof Category,
        @InjectModel(Seller) private readonly sellerModel: typeof Seller,
        @InjectModel(User) private readonly userModel: typeof User,
    ) { }

    async validateSeller(userId: number) {
        const seller = await this.sellerModel.findOne({
            where: { userId: userId },
            rejectOnEmpty: true
        });
        if (!seller) {
            throw new NotFoundException(`Seller not found with user id ${userId}`);
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
            rejectOnEmpty: true
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
            rejectOnEmpty: true
        });
        if (!subCategory) {
            throw new NotFoundException(`Sub-category with id ${categoryId} not found`);
        }

        const t = await this.sequelize.transaction();
        try {
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

            await t.commit();
            return await product.reload({ include: [{ model: this.productSkuModel, as: 'skus' }] });
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async updateProduct(id: number, updateProductDto: UpdateProductDto, userId: number): Promise<Product> {
        const seller = await this.validateSeller(userId);
        const product = await this.productModel.findOne({
            where: { id, sellerId: seller.id },
            include: [
                { model: this.productSkuModel, as: 'skus' }
            ],
            rejectOnEmpty: true
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
            rejectOnEmpty: true
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
            rejectOnEmpty: true
        });
        if (!product) {
            throw new NotFoundException(`Product not found`);
        }
        const skus = await this.productSkuModel.findAll({
            where: {
                productId
            },
        })
        if (!skus) throw new NotFoundException('no skus found')
        return skus
    }

    async getSku(productId: number, userId: number, skuId: number): Promise<ProductSku> {
        const seller = await this.validateSeller(userId);
        const product = await this.productModel.findOne({
            where: { id: productId, sellerId: seller.id },
            rejectOnEmpty: true
        });
        if (!product) {
            throw new NotFoundException(`Product not found`);
        }
        const sku = await this.productSkuModel.findOne({
            where: {
                productId,
                id: skuId
            },
            rejectOnEmpty: true
        })
        if (!sku) throw new NotFoundException('no skus found')
        return sku
    }

    async upsertSkus(productId: number, skus: CreateProductSkuDto[], userId: number): Promise<Product> {
        const seller = await this.validateSeller(userId);
        const product = await this.productModel.findOne({
            where: { id: productId, sellerId: seller.id },
            rejectOnEmpty: true
        });
        if (!product) {
            throw new NotFoundException(`Product not found`);
        }
        const t = await this.sequelize.transaction();
        try {
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
            await t.commit();
            return await product.reload({ include: [{ model: this.productSkuModel, as: 'skus' }] });
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async updateSku(skuId: number, userId: number, updateProductSkuDto: UpdateProductSkuDto): Promise<ProductSku> {
        const seller = await this.validateSeller(userId)
        const { quantity, price } = updateProductSkuDto
        const sku = await this.productSkuModel.findOne({
            where: { id: skuId },
            include: [{
                model: this.productModel,
                as: 'product',
                required: true,
            }],
            rejectOnEmpty: true
        })
        if (!(sku.product.sellerId == seller.id)) {
            throw new UnauthorizedException('unauthorized to edit this product')
        }
        if (updateProductSkuDto.price) sku.price = updateProductSkuDto.price
        if (updateProductSkuDto.quantity) sku.quantity = updateProductSkuDto.quantity
        await sku.save()
        return sku
    }

    async deleteSku(skuId: number, userId: number) {
        const seller = await this.validateSeller(userId)
        const sku = await this.productSkuModel.findOne({
            where: { id: skuId },
            include: [{
                model: this.productModel,
                as: 'product',
                required: true,
            }],
            rejectOnEmpty: true
        })
        if (!(sku.product.sellerId == seller.id)) {
            throw new UnauthorizedException('Unauthorized to access resorce')
        }
        await sku.destroy()
    }
}