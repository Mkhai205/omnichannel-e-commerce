import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import type {
  InventoryLogType,
  InventoryStockStatus,
} from '@repo/shared-types';
import { PrismaService } from '../../infrastructure/database/prisma.service';

const CHECKOUT_VARIANT_SELECT = {
  id: true,
  stockQuantity: true,
  product: {
    select: {
      shopId: true,
    },
  },
} satisfies Prisma.ProductVariantSelect;

const PRODUCT_VARIANT_SELECT = {
  id: true,
  productId: true,
  sku: true,
  attributes: true,
  price: true,
  stockQuantity: true,
  createdAt: true,
  updatedAt: true,
  product: {
    select: {
      id: true,
      shopId: true,
      name: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  },
} satisfies Prisma.ProductVariantSelect;

const WAREHOUSE_SELECT = {
  id: true,
  shopId: true,
  name: true,
  code: true,
  isDefault: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.WarehouseSelect;

const VARIANT_WAREHOUSE_INVENTORY_SELECT = {
  id: true,
  variantId: true,
  warehouseId: true,
  stockQuantity: true,
  createdAt: true,
  updatedAt: true,
  warehouse: {
    select: WAREHOUSE_SELECT,
  },
  variant: {
    select: PRODUCT_VARIANT_SELECT,
  },
} satisfies Prisma.VariantWarehouseInventorySelect;

const INVENTORY_LOG_SELECT = {
  id: true,
  variantId: true,
  warehouseId: true,
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

export type CheckoutVariantRecord = Prisma.ProductVariantGetPayload<{
  select: typeof CHECKOUT_VARIANT_SELECT;
}>;

export type WarehouseRecord = Prisma.WarehouseGetPayload<{
  select: typeof WAREHOUSE_SELECT;
}>;

export type VariantWarehouseInventoryRecord =
  Prisma.VariantWarehouseInventoryGetPayload<{
    select: typeof VARIANT_WAREHOUSE_INVENTORY_SELECT;
  }>;

export type InventoryLogRecord = Prisma.InventoryLogGetPayload<{
  select: typeof INVENTORY_LOG_SELECT;
}>;

export interface InventoryLogsQueryInput {
  page: number;
  limit: number;
  warehouseId?: string;
}

export interface SellerInventoryQueryInput {
  page: number;
  limit: number;
  search?: string;
  warehouseId?: string;
  status?: InventoryStockStatus;
  lowStockThreshold: number;
}

export interface InventoryLogMetricsQueryInput {
  userId: string;
  from: Date;
  to?: Date;
  warehouseId?: string;
}

@Injectable()
export class InventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  findVariantsByIds(
    variantIds: string[],
    tx?: Prisma.TransactionClient,
  ): Promise<CheckoutVariantRecord[]> {
    const client = tx ?? this.prisma;

    return client.productVariant.findMany({
      where: {
        id: {
          in: variantIds,
        },
      },
      select: CHECKOUT_VARIANT_SELECT,
    });
  }

  findShopByUserId(userId: string) {
    return this.prisma.shop.findUnique({
      where: { userId },
      select: SELLER_SHOP_SELECT,
    });
  }

  findWarehousesByUserId(userId: string): Promise<WarehouseRecord[]> {
    return this.prisma.warehouse.findMany({
      where: {
        shop: {
          userId,
        },
      },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
      select: WAREHOUSE_SELECT,
    });
  }

  findWarehouseByIdForSeller(
    userId: string,
    warehouseId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<WarehouseRecord | null> {
    const client = tx ?? this.prisma;

    return client.warehouse.findFirst({
      where: {
        id: warehouseId,
        shop: {
          userId,
        },
      },
      select: WAREHOUSE_SELECT,
    });
  }

  findDefaultWarehouseByShopId(
    shopId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<WarehouseRecord | null> {
    const client = tx ?? this.prisma;

    return client.warehouse.findFirst({
      where: {
        shopId,
        isDefault: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: WAREHOUSE_SELECT,
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

  findVariantWarehouseInventory(
    variantId: string,
    warehouseId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.variantWarehouseInventory.findUnique({
      where: {
        variantId_warehouseId: {
          variantId,
          warehouseId,
        },
      },
      select: VARIANT_WAREHOUSE_INVENTORY_SELECT,
    });
  }

  setVariantWarehouseInventoryStock(
    variantId: string,
    warehouseId: string,
    stockQuantity: number,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.variantWarehouseInventory.upsert({
      where: {
        variantId_warehouseId: {
          variantId,
          warehouseId,
        },
      },
      create: {
        variantId,
        warehouseId,
        stockQuantity,
      },
      update: {
        stockQuantity,
      },
      select: VARIANT_WAREHOUSE_INVENTORY_SELECT,
    });
  }

  sumStockByVariant(
    variantId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const client = tx ?? this.prisma;

    return client.variantWarehouseInventory
      .aggregate({
        where: {
          variantId,
        },
        _sum: {
          stockQuantity: true,
        },
      })
      .then((result) => result._sum.stockQuantity ?? 0);
  }

  decrementVariantWarehouseStockById(
    variantId: string,
    warehouseId: string,
    quantity: number,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.variantWarehouseInventory.updateMany({
      where: {
        variantId,
        warehouseId,
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

  findSellerInventoryItems(
    userId: string,
    input: SellerInventoryQueryInput,
  ): Promise<VariantWarehouseInventoryRecord[]> {
    return this.prisma.variantWarehouseInventory.findMany({
      where: this.buildSellerInventoryWhere(userId, input),
      skip: (input.page - 1) * input.limit,
      take: input.limit,
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      select: VARIANT_WAREHOUSE_INVENTORY_SELECT,
    });
  }

  countSellerInventoryItems(userId: string, input: SellerInventoryQueryInput) {
    return this.prisma.variantWarehouseInventory.count({
      where: this.buildSellerInventoryWhere(userId, input),
    });
  }

  findSellerInventoryRowsForOverview(userId: string, warehouseId?: string) {
    return this.prisma.variantWarehouseInventory.findMany({
      where: {
        warehouse: {
          shop: {
            userId,
          },
        },
        ...(warehouseId ? { warehouseId } : {}),
      },
      select: {
        stockQuantity: true,
        variant: {
          select: {
            price: true,
          },
        },
      },
    });
  }

  createInventoryLog(
    data: {
      variantId: string;
      warehouseId: string;
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
      where: {
        variantId,
        ...(input.warehouseId ? { warehouseId: input.warehouseId } : {}),
      },
      skip: (input.page - 1) * input.limit,
      take: input.limit,
      orderBy: { createdAt: 'desc' },
      select: INVENTORY_LOG_SELECT,
    });
  }

  countInventoryLogsByVariant(variantId: string, warehouseId?: string) {
    return this.prisma.inventoryLog.count({
      where: {
        variantId,
        ...(warehouseId ? { warehouseId } : {}),
      },
    });
  }

  findInventoryLogMetrics(input: InventoryLogMetricsQueryInput) {
    return this.prisma.inventoryLog.findMany({
      where: {
        variant: {
          product: {
            shop: {
              userId: input.userId,
            },
          },
        },
        ...(input.warehouseId ? { warehouseId: input.warehouseId } : {}),
        createdAt: {
          gte: input.from,
          ...(input.to ? { lt: input.to } : {}),
        },
      },
      select: {
        type: true,
        quantityChanged: true,
      },
    });
  }

  runInTransaction<T>(
    operation: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction((tx) => operation(tx));
  }

  private buildSellerInventoryWhere(
    userId: string,
    input: SellerInventoryQueryInput,
  ): Prisma.VariantWarehouseInventoryWhereInput {
    const where: Prisma.VariantWarehouseInventoryWhereInput = {
      warehouse: {
        shop: {
          userId,
        },
      },
    };

    if (input.warehouseId) {
      where.warehouseId = input.warehouseId;
    }

    if (input.search) {
      where.OR = [
        {
          variant: {
            sku: {
              contains: input.search,
              mode: 'insensitive',
            },
          },
        },
        {
          variant: {
            product: {
              name: {
                contains: input.search,
                mode: 'insensitive',
              },
            },
          },
        },
      ];
    }

    if (input.status === 'OUT_OF_STOCK') {
      where.stockQuantity = { equals: 0 };
    }

    if (input.status === 'LOW_STOCK') {
      where.AND = [
        {
          stockQuantity: {
            gt: 0,
          },
        },
        {
          stockQuantity: {
            lte: input.lowStockThreshold,
          },
        },
      ];
    }

    if (input.status === 'IN_STOCK') {
      where.stockQuantity = {
        gt: input.lowStockThreshold,
      };
    }

    return where;
  }
}
