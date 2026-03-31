import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateProductRequest,
  CreateProductVariantRequest,
  ProductItem,
  ProductVariantItem,
  SellerProductsFilterRequest,
  SellerProductsListResponse,
  UpdateProductRequest,
  UpdateProductVariantRequest,
} from '@repo/shared-types';
import type { ProductRecord, ProductVariantRecord } from './catalog.repository';
import { CatalogRepository } from './catalog.repository';

@Injectable()
export class SellerCatalogService {
  constructor(private readonly catalogRepository: CatalogRepository) {}

  async getMyProducts(
    userId: string,
    filters: SellerProductsFilterRequest,
  ): Promise<SellerProductsListResponse> {
    await this.ensureSellerShopExists(userId);

    const page = this.resolvePage(filters.page);
    const limit = this.resolveLimit(filters.limit);
    const search = filters.search?.trim();

    const query = {
      page,
      limit,
      search,
      categoryId: filters.categoryId,
      status: filters.status,
    };

    const [products, totalItems] = await Promise.all([
      this.catalogRepository.findSellerProducts(userId, query),
      this.catalogRepository.countSellerProducts(userId, query),
    ]);

    return {
      data: products.map((product) => this.toProductItem(product)),
      meta: {
        page,
        limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / limit),
      },
    };
  }

  async createMyProduct(
    userId: string,
    payload: CreateProductRequest,
  ): Promise<ProductItem> {
    const shop = await this.ensureSellerShopExists(userId);
    await this.ensureCategoryExists(payload.categoryId);

    const product = await this.catalogRepository.createProduct({
      shopId: shop.id,
      categoryId: payload.categoryId,
      name: payload.name.trim(),
      description: payload.description?.trim() || null,
      status: payload.status ?? 'DRAFT',
      omnichannelSyncStatus: payload.omnichannelSyncStatus ?? {},
    });

    return this.toProductItem(product);
  }

  async updateMyProduct(
    userId: string,
    productId: string,
    payload: UpdateProductRequest,
  ): Promise<ProductItem> {
    const product = await this.catalogRepository.findProductByIdForSeller(
      userId,
      productId,
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (payload.categoryId) {
      await this.ensureCategoryExists(payload.categoryId);
    }

    const hasPayload =
      payload.categoryId !== undefined ||
      payload.name !== undefined ||
      payload.description !== undefined ||
      payload.status !== undefined ||
      payload.omnichannelSyncStatus !== undefined;

    if (!hasPayload) {
      throw new BadRequestException('At least one field must be provided');
    }

    const updated = await this.catalogRepository.updateProductById(productId, {
      ...(payload.categoryId ? { categoryId: payload.categoryId } : {}),
      ...(payload.name !== undefined ? { name: payload.name.trim() } : {}),
      ...(payload.description !== undefined
        ? { description: payload.description?.trim() || null }
        : {}),
      ...(payload.status ? { status: payload.status } : {}),
      ...(payload.omnichannelSyncStatus
        ? { omnichannelSyncStatus: payload.omnichannelSyncStatus }
        : {}),
    });

    return this.toProductItem(updated);
  }

  async createMyVariant(
    userId: string,
    productId: string,
    payload: CreateProductVariantRequest,
  ): Promise<ProductVariantItem> {
    const product = await this.catalogRepository.findProductByIdForSeller(
      userId,
      productId,
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const variant = await this.catalogRepository.createVariant({
      productId,
      sku: payload.sku.trim(),
      attributes: payload.attributes,
      price: payload.price,
      stockQuantity: payload.stockQuantity ?? 0,
    });

    return this.toVariantItem(variant);
  }

  async updateMyVariant(
    userId: string,
    variantId: string,
    payload: UpdateProductVariantRequest,
  ): Promise<ProductVariantItem> {
    const variant = await this.catalogRepository.findVariantByIdForSeller(
      userId,
      variantId,
    );

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    const hasPayload =
      payload.attributes !== undefined ||
      payload.price !== undefined ||
      payload.stockQuantity !== undefined;

    if (!hasPayload) {
      throw new BadRequestException('At least one field must be provided');
    }

    const updated = await this.catalogRepository.updateVariantById(variantId, {
      ...(payload.attributes ? { attributes: payload.attributes } : {}),
      ...(payload.price ? { price: payload.price } : {}),
      ...(payload.stockQuantity !== undefined
        ? { stockQuantity: payload.stockQuantity }
        : {}),
    });

    return this.toVariantItem(updated);
  }

  private async ensureSellerShopExists(userId: string) {
    const shop = await this.catalogRepository.findShopByUserId(userId);

    if (!shop) {
      throw new NotFoundException('Seller shop not found');
    }

    return shop;
  }

  private async ensureCategoryExists(categoryId: string): Promise<void> {
    const category = await this.catalogRepository.findCategoryById(categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }
  }

  private resolvePage(page?: number): number {
    if (!page || Number.isNaN(page) || page < 1) {
      return 1;
    }

    return page;
  }

  private resolveLimit(limit?: number): number {
    if (!limit || Number.isNaN(limit) || limit < 1) {
      return 20;
    }

    if (limit > 100) {
      return 100;
    }

    return limit;
  }

  private toProductItem(product: ProductRecord): ProductItem {
    return {
      id: product.id,
      shopId: product.shopId,
      categoryId: product.categoryId,
      name: product.name,
      description: product.description,
      omnichannelSyncStatus: this.toStringRecord(product.omnichannelSyncStatus),
      status: product.status,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      variants: product.variants.map((variant) => this.toVariantItem(variant)),
    };
  }

  private toVariantItem(variant: ProductVariantRecord): ProductVariantItem {
    return {
      id: variant.id,
      productId: variant.productId,
      sku: variant.sku,
      attributes: this.toStringRecord(variant.attributes),
      price: variant.price.toString(),
      stockQuantity: variant.stockQuantity,
      createdAt: variant.createdAt.toISOString(),
      updatedAt: variant.updatedAt.toISOString(),
    };
  }

  private toStringRecord(value: unknown): Record<string, string> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, String(item)]),
    );
  }
}
