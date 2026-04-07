import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { extname } from 'node:path';
import type {
  CreateProductRequest,
  CreateProductVariantRequest,
  ProductItem,
  ProductVariantItem,
  SellerProductsFilterRequest,
  SellerProductsListResponse,
  UploadCatalogImageRequest,
  UploadCatalogImageResult,
  UpdateProductRequest,
  UpdateProductVariantRequest,
} from '@repo/shared-types';
import { resolveCatalogImageUrl } from '../../core/http/catalog-image-url.helper';
import { StorageService } from '../../infrastructure/storage/storage.service';
import type { ProductRecord, ProductVariantRecord } from './catalog.repository';
import { CatalogRepository } from './catalog.repository';

const SUPPORTED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const IMAGE_EXTENSION_BY_MIME_TYPE: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

export interface CatalogImageUploadFile {
  buffer: Buffer;
  size: number;
  mimetype: string;
  originalname: string;
}

@Injectable()
export class SellerCatalogService {
  constructor(
    private readonly catalogRepository: CatalogRepository,
    private readonly storageService: StorageService,
  ) {}

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

  async getMyProductById(
    userId: string,
    productId: string,
  ): Promise<ProductItem> {
    await this.ensureSellerShopExists(userId);

    const product = await this.catalogRepository.findProductByIdForSeller(
      userId,
      productId,
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.toProductItem(product);
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
      imageKey: this.normalizeImageKey(payload.imageKey),
      status: payload.status ?? 'DRAFT',
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
      payload.imageKey !== undefined ||
      payload.status !== undefined;

    if (!hasPayload) {
      throw new BadRequestException('At least one field must be provided');
    }

    const updated = await this.catalogRepository.updateProductById(productId, {
      ...(payload.categoryId ? { categoryId: payload.categoryId } : {}),
      ...(payload.name !== undefined ? { name: payload.name.trim() } : {}),
      ...(payload.description !== undefined
        ? { description: payload.description?.trim() || null }
        : {}),
      ...(payload.imageKey !== undefined
        ? { imageKey: this.normalizeImageKey(payload.imageKey) }
        : {}),
      ...(payload.status ? { status: payload.status } : {}),
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
      imageKey: this.normalizeImageKey(payload.imageKey),
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
      payload.imageKey !== undefined ||
      payload.stockQuantity !== undefined;

    if (!hasPayload) {
      throw new BadRequestException('At least one field must be provided');
    }

    const updated = await this.catalogRepository.updateVariantById(variantId, {
      ...(payload.attributes ? { attributes: payload.attributes } : {}),
      ...(payload.price ? { price: payload.price } : {}),
      ...(payload.imageKey !== undefined
        ? { imageKey: this.normalizeImageKey(payload.imageKey) }
        : {}),
      ...(payload.stockQuantity !== undefined
        ? { stockQuantity: payload.stockQuantity }
        : {}),
    });

    return this.toVariantItem(updated);
  }

  async deleteMyProduct(
    sellerUserId: string,
    productId: string,
  ): Promise<{ success: boolean }> {
    const product = await this.catalogRepository.findProductByIdForSeller(
      sellerUserId,
      productId,
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.catalogRepository.deleteProductById(productId);
    return { success: true };
  }

  async deleteMyVariant(
    sellerUserId: string,
    variantId: string,
  ): Promise<{ success: boolean }> {
    const variant = await this.catalogRepository.findVariantByIdForSeller(
      sellerUserId,
      variantId,
    );
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }
    await this.catalogRepository.deleteVariantById(variantId);
    return { success: true };
  }

  async uploadCatalogImage(
    userId: string,
    payload: UploadCatalogImageRequest,
    file?: CatalogImageUploadFile,
  ): Promise<UploadCatalogImageResult> {
    if (!file || !file.buffer || file.size <= 0) {
      throw new BadRequestException('Image file is required');
    }

    this.ensureSupportedImageMimeType(file.mimetype);

    const objectKey = await this.buildCatalogImageObjectKey(
      userId,
      payload,
      file,
    );

    const uploaded = await this.storageService.uploadObject({
      bucketName: 'products',
      objectName: objectKey,
      body: file.buffer,
      size: file.size,
      metadata: {
        contentType: file.mimetype,
        entityType: payload.entityType,
        entityId: payload.entityId,
        uploadedBy: userId,
      },
    });

    return {
      bucketName: uploaded.bucketName,
      objectKey: uploaded.objectName,
      imageUrl: resolveCatalogImageUrl(
        this.storageService,
        uploaded.objectName,
      ),
    };
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
      imageKey: product.imageKey,
      imageUrl: resolveCatalogImageUrl(this.storageService, product.imageKey),
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

  private async buildCatalogImageObjectKey(
    userId: string,
    payload: UploadCatalogImageRequest,
    file: Pick<CatalogImageUploadFile, 'mimetype' | 'originalname'>,
  ): Promise<string> {
    const extension = this.resolveImageExtension(file);

    switch (payload.entityType) {
      case 'CATEGORY': {
        await this.ensureCategoryExists(payload.entityId);

        return `categories/${payload.entityId}/cover${extension}`;
      }
      case 'PRODUCT': {
        const product = await this.catalogRepository.findProductByIdForSeller(
          userId,
          payload.entityId,
        );

        if (!product) {
          throw new NotFoundException('Product not found');
        }

        return `products/${payload.entityId}/main${extension}`;
      }
      case 'PRODUCT_VARIANT': {
        const variant = await this.catalogRepository.findVariantByIdForSeller(
          userId,
          payload.entityId,
        );

        if (!variant) {
          throw new NotFoundException('Variant not found');
        }

        return `products/${variant.productId}/variants/${payload.entityId}${extension}`;
      }
      default: {
        const exhaustiveCheck: never = payload.entityType;
        throw new BadRequestException(
          `Unsupported entity type: ${String(exhaustiveCheck)}`,
        );
      }
    }
  }

  private ensureSupportedImageMimeType(mimeType: string): void {
    if (!SUPPORTED_IMAGE_MIME_TYPES.has(mimeType)) {
      throw new BadRequestException(
        'Unsupported image type. Allowed: image/jpeg, image/png, image/webp, image/gif',
      );
    }
  }

  private resolveImageExtension(
    file: Pick<CatalogImageUploadFile, 'mimetype' | 'originalname'>,
  ): string {
    const extensionFromMimeType = IMAGE_EXTENSION_BY_MIME_TYPE[file.mimetype];

    if (extensionFromMimeType) {
      return extensionFromMimeType;
    }

    const normalizedExtension = extname(file.originalname ?? '').toLowerCase();
    const normalizedExtensionAlias =
      normalizedExtension === '.jpeg' ? '.jpg' : normalizedExtension;

    if (
      normalizedExtensionAlias === '.jpg' ||
      normalizedExtensionAlias === '.png' ||
      normalizedExtensionAlias === '.webp' ||
      normalizedExtensionAlias === '.gif'
    ) {
      return normalizedExtensionAlias;
    }

    throw new BadRequestException(
      'Unable to determine a supported image extension',
    );
  }

  private normalizeImageKey(imageKey?: string | null): string | null {
    if (imageKey === undefined || imageKey === null) {
      return null;
    }

    const normalized = imageKey.trim();

    return normalized.length > 0 ? normalized : null;
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
