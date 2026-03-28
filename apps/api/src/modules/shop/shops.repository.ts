import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import type { ShopStatus } from '@repo/shared-types';
import { PrismaService } from '../../infrastructure/database/prisma.service';

const PUBLIC_SHOP_SELECT = {
  id: true,
  shopName: true,
  slug: true,
  description: true,
} satisfies Prisma.ShopSelect;

const SHOP_DETAIL_SELECT = {
  id: true,
  userId: true,
  shopName: true,
  slug: true,
  description: true,
  businessLicense: true,
  status: true,
  rejectionReason: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ShopSelect;

const ADMIN_SHOP_SELECT = {
  id: true,
  userId: true,
  shopName: true,
  slug: true,
  description: true,
  businessLicense: true,
  status: true,
  rejectionReason: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      email: true,
      fullName: true,
    },
  },
} satisfies Prisma.ShopSelect;

export type PublicShopRecord = Prisma.ShopGetPayload<{
  select: typeof PUBLIC_SHOP_SELECT;
}>;

export type ShopDetailRecord = Prisma.ShopGetPayload<{
  select: typeof SHOP_DETAIL_SELECT;
}>;

export type AdminShopRecord = Prisma.ShopGetPayload<{
  select: typeof ADMIN_SHOP_SELECT;
}>;

export interface PublicShopsQueryInput {
  page: number;
  limit: number;
  search?: string;
}

export interface AdminShopsQueryInput {
  page: number;
  limit: number;
  search?: string;
  status?: ShopStatus;
}

@Injectable()
export class ShopsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findApprovedShops(input: PublicShopsQueryInput) {
    return this.prisma.shop.findMany({
      where: this.buildPublicWhere(input.search),
      skip: (input.page - 1) * input.limit,
      take: input.limit,
      orderBy: { createdAt: 'desc' },
      select: PUBLIC_SHOP_SELECT,
    });
  }

  countApprovedShops(search?: string) {
    return this.prisma.shop.count({
      where: this.buildPublicWhere(search),
    });
  }

  findApprovedShopBySlug(slug: string) {
    return this.prisma.shop.findFirst({
      where: {
        slug,
        status: 'APPROVED',
      },
      select: PUBLIC_SHOP_SELECT,
    });
  }

  findShopByUserId(userId: string) {
    return this.prisma.shop.findUnique({
      where: { userId },
      select: SHOP_DETAIL_SELECT,
    });
  }

  findShopById(id: string) {
    return this.prisma.shop.findUnique({
      where: { id },
      select: SHOP_DETAIL_SELECT,
    });
  }

  findShopBySlug(slug: string) {
    return this.prisma.shop.findUnique({
      where: { slug },
      select: SHOP_DETAIL_SELECT,
    });
  }

  updateShopById(id: string, data: Prisma.ShopUpdateInput) {
    return this.prisma.shop.update({
      where: { id },
      data,
      select: SHOP_DETAIL_SELECT,
    });
  }

  findAdminShops(input: AdminShopsQueryInput) {
    return this.prisma.shop.findMany({
      where: this.buildAdminWhere(input),
      skip: (input.page - 1) * input.limit,
      take: input.limit,
      orderBy: { createdAt: 'desc' },
      select: ADMIN_SHOP_SELECT,
    });
  }

  countAdminShops(input: AdminShopsQueryInput) {
    return this.prisma.shop.count({
      where: this.buildAdminWhere(input),
    });
  }

  private buildPublicWhere(search?: string): Prisma.ShopWhereInput {
    const where: Prisma.ShopWhereInput = {
      status: 'APPROVED',
    };

    if (!search) {
      return where;
    }

    return {
      ...where,
      OR: [
        {
          shopName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          slug: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ],
    };
  }

  private buildAdminWhere(input: AdminShopsQueryInput): Prisma.ShopWhereInput {
    const where: Prisma.ShopWhereInput = {};

    if (input.status) {
      where.status = input.status;
    }

    if (!input.search) {
      return where;
    }

    where.OR = [
      {
        shopName: {
          contains: input.search,
          mode: 'insensitive',
        },
      },
      {
        slug: {
          contains: input.search,
          mode: 'insensitive',
        },
      },
      {
        user: {
          email: {
            contains: input.search,
            mode: 'insensitive',
          },
        },
      },
      {
        user: {
          fullName: {
            contains: input.search,
            mode: 'insensitive',
          },
        },
      },
    ];

    return where;
  }
}
