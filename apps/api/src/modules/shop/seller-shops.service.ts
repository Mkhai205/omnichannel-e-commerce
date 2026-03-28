import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { SellerUpdateShopRequest, ShopDetail } from '@repo/shared-types';
import type { ShopDetailRecord } from './shops.repository';
import { ShopsRepository } from './shops.repository';

@Injectable()
export class SellerShopsService {
  constructor(private readonly shopsRepository: ShopsRepository) {}

  async getMyShop(userId: string): Promise<ShopDetail> {
    const shop = await this.shopsRepository.findShopByUserId(userId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return this.toShopDetail(shop);
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

    if (!shopName && !description && !businessLicense) {
      throw new BadRequestException('At least one field must be provided');
    }

    const updateData: {
      shopName?: string;
      slug?: string;
      description?: string;
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

  private async generateUniqueSlug(
    shopName: string,
    currentShopId: string,
  ): Promise<string> {
    const baseSlug = this.slugify(shopName);

    if (!baseSlug) {
      throw new BadRequestException('shopName does not produce a valid slug');
    }

    let candidate = baseSlug;
    let suffix = 1;

    while (suffix <= 1000) {
      const existing = await this.shopsRepository.findShopBySlug(candidate);

      if (!existing || existing.id === currentShopId) {
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
      businessLicense: shop.businessLicense,
      status: shop.status,
      rejectionReason: shop.rejectionReason,
      createdAt: shop.createdAt.toISOString(),
      updatedAt: shop.updatedAt.toISOString(),
    };
  }
}
