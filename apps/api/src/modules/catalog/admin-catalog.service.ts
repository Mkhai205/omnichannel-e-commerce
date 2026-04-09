import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  AdminProductsFilterRequest,
  AdminProductsListResponse,
  ProductItem,
  UpdateProductStatusRequest,
} from '@repo/shared-types';
import { resolveCatalogImageUrl } from '../../core/http/catalog-image-url.helper';
import { StorageService } from '../../infrastructure/storage/storage.service';
import type { ProductRecord } from './catalog.repository';
import { CatalogRepository } from './catalog.repository';

@Injectable()
export class AdminCatalogService {
  constructor(
    private readonly catalogRepository: CatalogRepository,
    private readonly storageService: StorageService,
  ) {}

  async getProducts(
    filters: AdminProductsFilterRequest,
  ): Promise<AdminProductsListResponse> {
    const page = this.resolvePage(filters.page);
    const limit = this.resolveLimit(filters.limit);
    const search = filters.search?.trim();

    const query = {
      page,
      limit,
      search,
      categoryId: filters.categoryId,
      shopId: filters.shopId,
      status: filters.status,
    };

    const [products, totalItems] = await Promise.all([
      this.catalogRepository.findAdminProducts(query),
      this.catalogRepository.countAdminProducts(query),
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

  async updateProductStatus(
    productId: string,
    payload: UpdateProductStatusRequest,
  ): Promise<ProductItem> {
    const product = await this.catalogRepository.findProductById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.status === payload.status) {
      throw new BadRequestException('Product status is unchanged');
    }

    const updatedProduct = await this.catalogRepository.updateProductById(
      productId,
      {
        status: payload.status,
      },
    );

    return this.toProductItem(updatedProduct);
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
    const ratingAverage = Number(product.ratingAverage.toString());

    return {
      id: product.id,
      shopId: product.shopId,
      categoryId: product.categoryId,
      name: product.name,
      description: product.description,
      imageKey: product.imageKey,
      imageUrl: resolveCatalogImageUrl(this.storageService, product.imageKey),
      status: product.status,
      ratingAverage: Number.isFinite(ratingAverage) ? ratingAverage : 0,
      ratingCount: product.ratingCount,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      variants: product.variants.map((variant) => ({
        id: variant.id,
        productId: variant.productId,
        sku: variant.sku,
        attributes: this.toStringRecord(variant.attributes),
        price: variant.price.toString(),
        imageKey: variant.imageKey,
        imageUrl: resolveCatalogImageUrl(
          this.storageService,
          variant.imageKey,
          product.imageKey,
        ),
        stockQuantity: variant.stockQuantity,
        createdAt: variant.createdAt.toISOString(),
        updatedAt: variant.updatedAt.toISOString(),
      })),
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
