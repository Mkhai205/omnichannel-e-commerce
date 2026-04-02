import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  PublicShopItem,
  PublicShopsFilterRequest,
  PublicShopsListResponse,
} from '@repo/shared-types';
import {
  resolveShopAvatarUrl,
  resolveShopCoverUrl,
} from '../../core/http/shop-avatar-url.helper';
import { StorageService } from '../../infrastructure/storage/storage.service';
import type { PublicShopRecord } from './shops.repository';
import { ShopsRepository } from './shops.repository';

@Injectable()
export class PublicShopsService {
  constructor(
    private readonly shopsRepository: ShopsRepository,
    private readonly storageService: StorageService,
  ) {}

  async getPublicShops(
    filters: PublicShopsFilterRequest,
  ): Promise<PublicShopsListResponse> {
    const page = this.resolvePage(filters.page);
    const limit = this.resolveLimit(filters.limit);
    const search = filters.search?.trim();

    const [shops, totalItems] = await Promise.all([
      this.shopsRepository.findApprovedShops({ page, limit, search }),
      this.shopsRepository.countApprovedShops(search),
    ]);

    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);

    return {
      data: shops.map((shop) => this.toPublicShop(shop)),
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  async getPublicShopBySlug(slug: string): Promise<PublicShopItem> {
    const normalizedSlug = slug.trim();
    const shop =
      await this.shopsRepository.findApprovedShopBySlug(normalizedSlug);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return this.toPublicShop(shop);
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

  private toPublicShop(shop: PublicShopRecord): PublicShopItem {
    return {
      id: shop.id,
      shopName: shop.shopName,
      slug: shop.slug,
      description: shop.description,
      avatarKey: shop.avatarKey,
      avatarUrl: resolveShopAvatarUrl(this.storageService, shop.avatarKey),
      coverKey: shop.coverKey,
      coverUrl: resolveShopCoverUrl(this.storageService, shop.coverKey),
    };
  }
}
