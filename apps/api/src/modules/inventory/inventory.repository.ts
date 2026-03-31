import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import type { InventoryLogType } from '@repo/shared-types';
import { PrismaService } from '../../infrastructure/database/prisma.service';

const PRODUCT_VARIANT_SELECT = {
  id: true,
  productId: true,
  sku: true,
  attributes: true,
  price: true,
  stockQuantity: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProductVariantSelect;

const INVENTORY_LOG_SELECT = {
  id: true,
  variantId: true,
  type: true,
  quantityChanged: true,
  note: true,
  createdAt: true,
} satisfies Prisma.InventoryLogSelect;

const SELLER_SHOP_SELECT = {
  id: true,
  userId: true,
} satisfies Prisma.ShopSelect;

export type ProductVariantRecord = Prisma.ProductVariantGetPayload<{
  select: typeof PRODUCT_VARIANT_SELECT;
}>;

export type InventoryLogRecord = Prisma.InventoryLogGetPayload<{
  select: typeof INVENTORY_LOG_SELECT;
}>;

export interface InventoryLogsQueryInput {
  page: number;
  limit: number;
}

@Injectable()
export class InventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  findVariantsByIds(variantIds: string[], tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.productVariant.findMany({
      where: {
        id: {
          in: variantIds,
        },
      },
      select: PRODUCT_VARIANT_SELECT,
    });
  }

  findShopByUserId(userId: string) {
    return this.prisma.shop.findUnique({
      where: { userId },
      select: SELLER_SHOP_SELECT,
    });
  }

  findVariantByIdForSeller(userId: string, variantId: string) {
    return this.prisma.productVariant.findFirst({
      where: {
        id: variantId,
        product: {
          shop: {
            userId,
          },
        },
      },
      select: PRODUCT_VARIANT_SELECT,
    });
  }

  updateVariantById(
    variantId: string,
    data: Prisma.ProductVariantUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.productVariant.update({
      where: { id: variantId },
      data,
      select: PRODUCT_VARIANT_SELECT,
    });
  }

  decrementVariantStockById(
    variantId: string,
    quantity: number,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.productVariant.updateMany({
      where: {
        id: variantId,
        stockQuantity: {
          gte: quantity,
        },
      },
      data: {
        stockQuantity: {
          decrement: quantity,
        },
      },
    });
  }

  createInventoryLog(
    data: {
      variantId: string;
      type: InventoryLogType;
      quantityChanged: number;
      note?: string | null;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.inventoryLog.create({
      data,
      select: INVENTORY_LOG_SELECT,
    });
  }

  findInventoryLogsByVariant(
    variantId: string,
    input: InventoryLogsQueryInput,
  ) {
    return this.prisma.inventoryLog.findMany({
      where: { variantId },
      skip: (input.page - 1) * input.limit,
      take: input.limit,
      orderBy: { createdAt: 'desc' },
      select: INVENTORY_LOG_SELECT,
    });
  }

  countInventoryLogsByVariant(variantId: string) {
    return this.prisma.inventoryLog.count({
      where: { variantId },
    });
  }

  runInTransaction<T>(
    operation: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction((tx) => operation(tx));
  }
}
