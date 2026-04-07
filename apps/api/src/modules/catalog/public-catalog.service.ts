import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  CategoriesListResponse,
  CategoryItem,
  ProductItem,
  ProductVariantItem,
  PublicProductsFilterRequest,
  PublicProductsListResponse,
} from '@repo/shared-types';
import { resolveCatalogImageUrl } from '../../core/http/catalog-image-url.helper';
import { StorageService } from '../../infrastructure/storage/storage.service';
import type {
  CategoryRecord,
  ProductRecord,
  ProductVariantRecord,
} from './catalog.repository';
import { CatalogRepository } from './catalog.repository';

@Injectable()
export class PublicCatalogService {
  constructor(
    private readonly catalogRepository: CatalogRepository,
    private readonly storageService: StorageService,
  ) {}

  async getCategories(filters: {
    page?: number;
    limit?: number;
    parentId?: string;
    search?: string;
  }): Promise<CategoriesListResponse> {
    const page = this.resolvePage(filters.page);
    const limit = this.resolveLimit(filters.limit);
    const search = filters.search?.trim();

    const query = {
      page,
      limit,
      parentId: filters.parentId,
      search,
    };

    const [categories, totalItems] = await Promise.all([
      this.catalogRepository.findCategories(query),
      this.catalogRepository.countCategories(query),
    ]);

    return {
      data: categories.map((category) => this.toCategoryItem(category)),
      meta: {
        page,
        limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / limit),
      },
    };
  }

  async getProducts(
    filters: PublicProductsFilterRequest,
  ): Promise<PublicProductsListResponse> {
    const page = this.resolvePage(filters.page);
    const limit = this.resolveLimit(filters.limit);
    const search = filters.search?.trim();

    const query = {
      page,
      limit,
      search,
      categoryId: filters.categoryId,
      shopId: filters.shopId,
    };

    const [products, totalItems] = await Promise.all([
      this.catalogRepository.findPublicProducts(query),
      this.catalogRepository.countPublicProducts(query),
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

  async getProductById(productId: string): Promise<ProductItem> {
    const product =
      await this.catalogRepository.findPublicProductById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.toProductItem(product);
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

  private toCategoryItem(category: CategoryRecord): CategoryItem {
    return {
      id: category.id,
      parentId: category.parentId,
      name: category.name,
      slug: category.slug,
      imageKey: category.imageKey,
      imageUrl: resolveCatalogImageUrl(this.storageService, category.imageKey),
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  private toProductItem(product: ProductRecord): ProductItem {
    return {
      id: product.id,
      shopId: product.shopId,
      categoryId: product.categoryId,
      name: product.name,
      description: product.description,
      imageKey: product.imageKey,
      imageUrl: resolveCatalogImageUrl(this.storageService, product.imageKey),
      omnichannelSyncStatus: this.toStringRecord(product.omnichannelSyncStatus),
      status: product.status,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      variants: product.variants.map((variant) =>
        this.toVariantItem(variant, product.imageKey),
      ),
    };
  }

  private toVariantItem(
    variant: ProductVariantRecord,
    fallbackProductImageKey?: string | null,
  ): ProductVariantItem {
    return {
      id: variant.id,
      productId: variant.productId,
      sku: variant.sku,
      attributes: this.toStringRecord(variant.attributes),
      price: variant.price.toString(),
      imageKey: variant.imageKey,
      imageUrl: resolveCatalogImageUrl(
        this.storageService,
        variant.imageKey,
        fallbackProductImageKey,
      ),
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
