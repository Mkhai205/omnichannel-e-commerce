import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { extname } from 'node:path';
import type {
  SellerCreateShopOnboardingRequest,
  SellerUpdateShopRequest,
  ShopDetail,
  UploadShopAvatarResult,
} from '@repo/shared-types';
import { resolveShopAvatarUrl } from '../../core/http/shop-avatar-url.helper';
import { StorageService } from '../../infrastructure/storage/storage.service';
import type { ShopDetailRecord } from './shops.repository';
import { ShopsRepository } from './shops.repository';

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

export interface ShopAvatarUploadFile {
  buffer: Buffer;
  size: number;
  mimetype: string;
  originalname: string;
}

@Injectable()
export class SellerShopsService {
  constructor(
    private readonly shopsRepository: ShopsRepository,
    private readonly storageService: StorageService,
  ) {}

  async getMyShop(userId: string): Promise<ShopDetail> {
    const shop = await this.shopsRepository.findShopByUserId(userId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return this.toShopDetail(shop);
  }

  async createOnboardingShop(
    userId: string,
    payload: SellerCreateShopOnboardingRequest,
  ): Promise<ShopDetail> {
    const existingShop = await this.shopsRepository.findShopByUserId(userId);

    if (existingShop) {
      return this.toShopDetail(existingShop);
    }

    const shopName = payload.shopName.trim();
    const description = payload.description?.trim();
    const businessLicense = payload.businessLicense?.trim();

    const slug = await this.generateUniqueSlug(shopName);

    const createdShop = await this.shopsRepository.createShop({
      userId,
      shopName,
      slug,
      description,
      businessLicense,
      status: 'PENDING',
    });

    return this.toShopDetail(createdShop);
  }

  async updateMyShop(
    userId: string,
    payload: SellerUpdateShopRequest,
  ): Promise<ShopDetail> {
    const currentShop = await this.shopsRepository.findShopByUserId(userId);

    if (!currentShop) {
      throw new NotFoundException('Shop not found');
    }

    const shopName = payload.shopName?.trim();
    const description = payload.description?.trim();
    const businessLicense = payload.businessLicense?.trim();
    const avatarKey = this.normalizeAvatarKey(payload.avatarKey);

    const hasPayload =
      payload.shopName !== undefined ||
      payload.description !== undefined ||
      payload.businessLicense !== undefined ||
      payload.avatarKey !== undefined;

    if (!hasPayload) {
      throw new BadRequestException('At least one field must be provided');
    }

    const updateData: {
      shopName?: string;
      slug?: string;
      description?: string;
      avatarKey?: string | null;
      businessLicense?: string;
      status?: 'PENDING';
      rejectionReason?: null;
    } = {};

    if (shopName) {
      const slug = await this.generateUniqueSlug(shopName, currentShop.id);
      updateData.shopName = shopName;
      updateData.slug = slug;
    }

    if (description) {
      updateData.description = description;
    }

    if (payload.avatarKey !== undefined) {
      updateData.avatarKey = avatarKey;
    }

    if (businessLicense) {
      updateData.businessLicense = businessLicense;
    }

    // Allow seller to resubmit rejected shop profile for admin review.
    if (currentShop.status === 'REJECTED') {
      updateData.status = 'PENDING';
      updateData.rejectionReason = null;
    }

    const updatedShop = await this.shopsRepository.updateShopById(
      currentShop.id,
      updateData,
    );

    return this.toShopDetail(updatedShop);
  }

  async uploadMyShopAvatar(
    userId: string,
    file?: ShopAvatarUploadFile,
  ): Promise<UploadShopAvatarResult> {
    if (!file || !file.buffer || file.size <= 0) {
      throw new BadRequestException('Image file is required');
    }

    this.ensureSupportedImageMimeType(file.mimetype);

    const shop = await this.shopsRepository.findShopByUserId(userId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const objectKey = `shops/${shop.id}/avatar${this.resolveImageExtension(file)}`;

    const uploaded = await this.storageService.uploadObject({
      bucketName: 'products',
      objectName: objectKey,
      body: file.buffer,
      size: file.size,
      metadata: {
        contentType: file.mimetype,
        entityType: 'SHOP',
        entityId: shop.id,
        uploadedBy: userId,
      },
    });

    await this.shopsRepository.updateShopById(shop.id, {
      avatarKey: uploaded.objectName,
      ...(shop.status === 'REJECTED'
        ? {
            status: 'PENDING',
            rejectionReason: null,
          }
        : {}),
    });

    return {
      bucketName: uploaded.bucketName,
      objectKey: uploaded.objectName,
      avatarUrl: resolveShopAvatarUrl(this.storageService, uploaded.objectName),
    };
  }

  private async generateUniqueSlug(
    shopName: string,
    currentShopId?: string,
  ): Promise<string> {
    const baseSlug = this.slugify(shopName);

    if (!baseSlug) {
      throw new BadRequestException('shopName does not produce a valid slug');
    }

    let candidate = baseSlug;
    let suffix = 1;

    while (suffix <= 1000) {
      const existing = await this.shopsRepository.findShopBySlug(candidate);

      if (!existing || (currentShopId && existing.id === currentShopId)) {
        return candidate;
      }

      candidate = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    throw new ConflictException('Unable to generate a unique slug for shop');
  }

  private slugify(input: string): string {
    return input
      .normalize('NFKD')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private toShopDetail(shop: ShopDetailRecord): ShopDetail {
    return {
      id: shop.id,
      userId: shop.userId,
      shopName: shop.shopName,
      slug: shop.slug,
      description: shop.description,
      avatarKey: shop.avatarKey,
      avatarUrl: resolveShopAvatarUrl(this.storageService, shop.avatarKey),
      businessLicense: shop.businessLicense,
      status: shop.status,
      rejectionReason: shop.rejectionReason,
      createdAt: shop.createdAt.toISOString(),
      updatedAt: shop.updatedAt.toISOString(),
    };
  }

  private normalizeAvatarKey(avatarKey?: string | null): string | null {
    if (avatarKey === undefined || avatarKey === null) {
      return null;
    }

    const normalized = avatarKey.trim();

    return normalized.length > 0 ? normalized : null;
  }

  private ensureSupportedImageMimeType(mimeType: string): void {
    if (!SUPPORTED_IMAGE_MIME_TYPES.has(mimeType)) {
      throw new BadRequestException(
        'Unsupported image type. Allowed: image/jpeg, image/png, image/webp, image/gif',
      );
    }
  }

  private resolveImageExtension(
    file: Pick<ShopAvatarUploadFile, 'mimetype' | 'originalname'>,
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
}
