import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  AdminShopItem,
  AdminShopsFilterRequest,
  AdminShopsListResponse,
  AdminUpdateShopStatusRequest,
  ShopDetail,
} from '@repo/shared-types';
import {
  resolveShopAvatarUrl,
  resolveShopCoverUrl,
} from '../../core/http/shop-avatar-url.helper';
import { StorageService } from '../../infrastructure/storage/storage.service';
import type { AdminShopRecord, ShopDetailRecord } from './shops.repository';
import { ShopsRepository } from './shops.repository';

@Injectable()
export class AdminShopsService {
  constructor(
    private readonly shopsRepository: ShopsRepository,
    private readonly storageService: StorageService,
  ) {}

  async getAdminShops(
    filters: AdminShopsFilterRequest,
  ): Promise<AdminShopsListResponse> {
    const page = this.resolvePage(filters.page);
    const limit = this.resolveLimit(filters.limit);
    const search = filters.search?.trim();

    const query = {
      page,
      limit,
      search,
      status: filters.status,
    };

    const [shops, totalItems] = await Promise.all([
      this.shopsRepository.findAdminShops(query),
      this.shopsRepository.countAdminShops(query),
    ]);

    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);

    return {
      data: shops.map((shop) => this.toAdminShopItem(shop)),
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  async getAdminShopById(shopId: string): Promise<ShopDetail> {
    const shop = await this.shopsRepository.findShopById(shopId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return this.toShopDetail(shop);
  }

  async updateAdminShopStatus(
    shopId: string,
    payload: AdminUpdateShopStatusRequest,
  ): Promise<ShopDetail> {
    const shop = await this.shopsRepository.findShopById(shopId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const rejectionReason = payload.rejectionReason?.trim();

    if (payload.status === 'REJECTED' && !rejectionReason) {
      throw new BadRequestException(
        'rejectionReason is required when status is REJECTED',
      );
    }

    const updatedShop = await this.shopsRepository.updateShopById(shopId, {
      status: payload.status,
      rejectionReason: payload.status === 'REJECTED' ? rejectionReason : null,
    });

    return this.toShopDetail(updatedShop);
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

  private toAdminShopItem(shop: AdminShopRecord): AdminShopItem {
    return {
      id: shop.id,
      userId: shop.userId,
      shopName: shop.shopName,
      slug: shop.slug,
      description: shop.description,
      avatarKey: shop.avatarKey,
      avatarUrl: resolveShopAvatarUrl(this.storageService, shop.avatarKey),
      coverKey: shop.coverKey,
      coverUrl: resolveShopCoverUrl(this.storageService, shop.coverKey),
      businessLicense: shop.businessLicense,
      status: shop.status,
      rejectionReason: shop.rejectionReason,
      createdAt: shop.createdAt.toISOString(),
      updatedAt: shop.updatedAt.toISOString(),
      ownerEmail: shop.user.email,
      ownerFullName: shop.user.fullName,
    };
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
      coverKey: shop.coverKey,
      coverUrl: resolveShopCoverUrl(this.storageService, shop.coverKey),
      businessLicense: shop.businessLicense,
      status: shop.status,
      rejectionReason: shop.rejectionReason,
      createdAt: shop.createdAt.toISOString(),
      updatedAt: shop.updatedAt.toISOString(),
    };
  }
}
