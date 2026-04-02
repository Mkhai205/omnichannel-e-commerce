import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@repo/database';
import type {
  CreateSellerInventoryAdjustmentRequest,
  CreateInventoryLogRequest,
  InventoryStockStatus,
  InventoryLogItem,
  InventoryLogsListResponse,
  SellerInventoryFilterRequest,
  SellerInventoryListResponse,
  SellerInventoryOverview,
  SellerInventoryOverviewFilterRequest,
  SellerWarehouseItem,
} from '@repo/shared-types';
import type {
  InventoryLogRecord,
  InventoryLogMetricsQueryInput,
  ProductVariantRecord,
  WarehouseRecord,
} from './inventory.repository';
import { InventoryRepository } from './inventory.repository';

const LOW_STOCK_THRESHOLD = 10;

export interface CheckoutInventoryDeductionItem {
  variantId: string;
  quantity: number;
}

@Injectable()
export class SellerInventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async deductStockForCheckout(
    items: CheckoutInventoryDeductionItem[],
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    if (items.length === 0) {
      return;
    }

    const mergedByVariantId = new Map<string, number>();

    for (const item of items) {
      if (item.quantity < 1) {
        throw new BadRequestException('Quantity must be greater than 0');
      }

      mergedByVariantId.set(
        item.variantId,
        (mergedByVariantId.get(item.variantId) ?? 0) + item.quantity,
      );
    }

    const variantIds = [...mergedByVariantId.keys()];
    const variants = await this.inventoryRepository.findVariantsByIds(
      variantIds,
      tx,
    );
    const variantById = new Map(
      variants.map((variant) => [variant.id, variant]),
    );

    for (const [variantId, quantity] of mergedByVariantId.entries()) {
      const variant = variantById.get(variantId);

      if (!variant) {
        throw new NotFoundException(`Product variant not found: ${variantId}`);
      }

      const defaultWarehouse =
        await this.inventoryRepository.findDefaultWarehouseByShopId(
          variant.product.shopId,
          tx,
        );

      if (!defaultWarehouse) {
        throw new NotFoundException(
          `Default warehouse not found for shop ${variant.product.shopId}`,
        );
      }

      if (variant.stockQuantity < quantity) {
        throw new BadRequestException(
          `Requested quantity exceeds stock (${variant.stockQuantity})`,
        );
      }

      const warehouseResult =
        await this.inventoryRepository.decrementVariantWarehouseStockById(
          variantId,
          defaultWarehouse.id,
          quantity,
          tx,
        );

      if (warehouseResult.count !== 1) {
        throw new BadRequestException(
          `Insufficient default warehouse stock for variant ${variantId}`,
        );
      }

      const result = await this.inventoryRepository.decrementVariantStockById(
        variantId,
        quantity,
        tx,
      );

      if (result.count !== 1) {
        throw new BadRequestException(
          `Unable to deduct inventory for variant ${variantId}`,
        );
      }

      await this.inventoryRepository.createInventoryLog(
        {
          variantId,
          warehouseId: defaultWarehouse.id,
          type: 'ORDER_DEDUCT',
          quantityChanged: -quantity,
          note: 'Stock deducted by checkout',
        },
        tx,
      );
    }
  }

  async createMyInventoryLog(
    userId: string,
    variantId: string,
    payload: CreateInventoryLogRequest,
  ): Promise<InventoryLogItem> {
    await this.ensureSellerShopExists(userId);

    const variant = await this.inventoryRepository.findVariantByIdForSeller(
      userId,
      variantId,
    );

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    if (payload.quantityChanged === 0) {
      throw new BadRequestException('quantityChanged must be different from 0');
    }

    const log = await this.inventoryRepository.runInTransaction(async (tx) => {
      const warehouse = await this.resolveWarehouseForVariant(
        userId,
        variant,
        payload.warehouseId,
        tx,
      );

      const currentWarehouseInventory =
        await this.inventoryRepository.findVariantWarehouseInventory(
          variantId,
          warehouse.id,
          tx,
        );

      const nextWarehouseStock =
        (currentWarehouseInventory?.stockQuantity ?? 0) +
        payload.quantityChanged;

      if (nextWarehouseStock < 0) {
        throw new BadRequestException('Stock quantity cannot be negative');
      }

      await this.inventoryRepository.setVariantWarehouseInventoryStock(
        variantId,
        warehouse.id,
        nextWarehouseStock,
        tx,
      );

      const nextTotalStock = await this.inventoryRepository.sumStockByVariant(
        variantId,
        tx,
      );

      await this.inventoryRepository.updateVariantById(
        variantId,
        {
          stockQuantity: nextTotalStock,
        },
        tx,
      );

      return this.inventoryRepository.createInventoryLog(
        {
          variantId,
          warehouseId: warehouse.id,
          type: payload.type,
          quantityChanged: payload.quantityChanged,
          note: payload.note?.trim() || null,
        },
        tx,
      );
    });

    return this.toInventoryLogItem(log);
  }

  async createMyInventoryAdjustment(
    userId: string,
    variantId: string,
    payload: CreateSellerInventoryAdjustmentRequest,
  ): Promise<InventoryLogItem> {
    const quantityChanged =
      payload.type === 'EXPORT' ? -payload.quantity : payload.quantity;

    return this.createMyInventoryLog(userId, variantId, {
      type: payload.type,
      quantityChanged,
      warehouseId: payload.warehouseId,
      note: payload.note,
    });
  }

  async getMyWarehouses(userId: string): Promise<SellerWarehouseItem[]> {
    await this.ensureSellerShopExists(userId);

    const warehouses =
      await this.inventoryRepository.findWarehousesByUserId(userId);

    return warehouses.map((warehouse) => ({
      id: warehouse.id,
      name: warehouse.name,
      code: warehouse.code,
      isDefault: warehouse.isDefault,
    }));
  }

  async getMyInventory(
    userId: string,
    filters: SellerInventoryFilterRequest,
  ): Promise<SellerInventoryListResponse> {
    await this.ensureSellerShopExists(userId);

    if (filters.warehouseId) {
      await this.ensureWarehouseBelongsToSeller(userId, filters.warehouseId);
    }

    const page = this.resolvePage(filters.page);
    const limit = this.resolveLimit(filters.limit);
    const search = filters.search?.trim();

    const query = {
      page,
      limit,
      search,
      warehouseId: filters.warehouseId,
      status: filters.status,
      lowStockThreshold: LOW_STOCK_THRESHOLD,
    };

    const [rows, totalItems] = await Promise.all([
      this.inventoryRepository.findSellerInventoryItems(userId, query),
      this.inventoryRepository.countSellerInventoryItems(userId, query),
    ]);

    return {
      data: rows.map((row) => ({
        variantId: row.variant.id,
        productId: row.variant.product.id,
        sku: row.variant.sku,
        productName: row.variant.product.name,
        categoryLabel: row.variant.product.category.name,
        brandLabel: this.resolveBrandLabel(row.variant.attributes),
        warehouseId: row.warehouse.id,
        warehouseName: row.warehouse.name,
        currentStock: row.stockQuantity,
        status: this.resolveInventoryStatus(row.stockQuantity),
      })),
      meta: {
        page,
        limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / limit),
      },
    };
  }

  async getMyInventoryOverview(
    userId: string,
    filters: SellerInventoryOverviewFilterRequest,
  ): Promise<SellerInventoryOverview> {
    await this.ensureSellerShopExists(userId);

    if (filters.warehouseId) {
      await this.ensureWarehouseBelongsToSeller(userId, filters.warehouseId);
    }

    const inventoryRows =
      await this.inventoryRepository.findSellerInventoryRowsForOverview(
        userId,
        filters.warehouseId,
      );

    const totalInventoryValue = inventoryRows.reduce((sum, row) => {
      return sum + Number(row.variant.price) * row.stockQuantity;
    }, 0);

    const lowStockCount = inventoryRows.reduce((count, row) => {
      if (row.stockQuantity > 0 && row.stockQuantity <= LOW_STOCK_THRESHOLD) {
        return count + 1;
      }

      return count;
    }, 0);

    const [todayMetrics, currentMonthMetrics, previousMonthMetrics] =
      await Promise.all([
        this.inventoryRepository.findInventoryLogMetrics(
          this.buildTodayMetricsQuery(userId, filters.warehouseId),
        ),
        this.inventoryRepository.findInventoryLogMetrics(
          this.buildCurrentMonthMetricsQuery(userId, filters.warehouseId),
        ),
        this.inventoryRepository.findInventoryLogMetrics(
          this.buildPreviousMonthMetricsQuery(userId, filters.warehouseId),
        ),
      ]);

    const inboundToday = this.calculateInboundUnits(todayMetrics);
    const outboundToday = this.calculateOutboundUnits(todayMetrics);
    const monthlyGrowthPercent = this.calculateMonthlyGrowthPercent(
      currentMonthMetrics,
      previousMonthMetrics,
    );

    return {
      totalInventoryValue: totalInventoryValue.toFixed(2),
      totalInventoryCurrency: 'VND',
      monthlyGrowthPercent,
      lowStockCount,
      inboundToday,
      outboundToday,
      inboundProgressPercent:
        inboundToday + outboundToday === 0
          ? 0
          : Math.round((inboundToday / (inboundToday + outboundToday)) * 100),
    };
  }

  async getMyVariantInventoryLogs(
    userId: string,
    variantId: string,
    filters: { page?: number; limit?: number; warehouseId?: string },
  ): Promise<InventoryLogsListResponse> {
    await this.ensureSellerShopExists(userId);

    const variant = await this.inventoryRepository.findVariantByIdForSeller(
      userId,
      variantId,
    );

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    if (filters.warehouseId) {
      await this.ensureWarehouseBelongsToSeller(userId, filters.warehouseId);
    }

    const page = this.resolvePage(filters.page);
    const limit = this.resolveLimit(filters.limit);

    const [logs, totalItems] = await Promise.all([
      this.inventoryRepository.findInventoryLogsByVariant(variantId, {
        page,
        limit,
        warehouseId: filters.warehouseId,
      }),
      this.inventoryRepository.countInventoryLogsByVariant(
        variantId,
        filters.warehouseId,
      ),
    ]);

    return {
      data: logs.map((log) => this.toInventoryLogItem(log)),
      meta: {
        page,
        limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / limit),
      },
    };
  }

  private async ensureWarehouseBelongsToSeller(
    userId: string,
    warehouseId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<WarehouseRecord> {
    const warehouse = await this.inventoryRepository.findWarehouseByIdForSeller(
      userId,
      warehouseId,
      tx,
    );

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return warehouse;
  }

  private async resolveWarehouseForVariant(
    userId: string,
    variant: ProductVariantRecord,
    warehouseId: string | undefined,
    tx: Prisma.TransactionClient,
  ): Promise<WarehouseRecord> {
    if (warehouseId) {
      const warehouse = await this.ensureWarehouseBelongsToSeller(
        userId,
        warehouseId,
        tx,
      );

      if (warehouse.shopId !== variant.product.shopId) {
        throw new BadRequestException(
          'Warehouse does not belong to variant shop',
        );
      }

      return warehouse;
    }

    const defaultWarehouse =
      await this.inventoryRepository.findDefaultWarehouseByShopId(
        variant.product.shopId,
        tx,
      );

    if (!defaultWarehouse) {
      throw new NotFoundException(
        'Default warehouse not found for seller shop',
      );
    }

    return defaultWarehouse;
  }

  private async ensureSellerShopExists(userId: string) {
    const shop = await this.inventoryRepository.findShopByUserId(userId);

    if (!shop) {
      throw new NotFoundException('Seller shop not found');
    }

    return shop;
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

  private resolveBrandLabel(attributes: unknown): string {
    if (!attributes || typeof attributes !== 'object') {
      return 'N/A';
    }

    const attributesRecord = attributes as Record<string, unknown>;

    if (
      typeof attributesRecord.brand === 'string' &&
      attributesRecord.brand.trim().length > 0
    ) {
      return attributesRecord.brand.trim().toUpperCase();
    }

    return 'N/A';
  }

  private resolveInventoryStatus(stockQuantity: number): InventoryStockStatus {
    if (stockQuantity <= 0) {
      return 'OUT_OF_STOCK';
    }

    if (stockQuantity <= LOW_STOCK_THRESHOLD) {
      return 'LOW_STOCK';
    }

    return 'IN_STOCK';
  }

  private buildTodayMetricsQuery(
    userId: string,
    warehouseId?: string,
  ): InventoryLogMetricsQueryInput {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    return {
      userId,
      warehouseId,
      from: start,
      to: end,
    };
  }

  private buildCurrentMonthMetricsQuery(
    userId: string,
    warehouseId?: string,
  ): InventoryLogMetricsQueryInput {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);

    return {
      userId,
      warehouseId,
      from: start,
      to: end,
    };
  }

  private buildPreviousMonthMetricsQuery(
    userId: string,
    warehouseId?: string,
  ): InventoryLogMetricsQueryInput {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    start.setMonth(start.getMonth() - 1);

    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);

    return {
      userId,
      warehouseId,
      from: start,
      to: end,
    };
  }

  private calculateInboundUnits(
    metrics: Array<{ type: string; quantityChanged: number }>,
  ): number {
    return metrics.reduce((sum, item) => {
      if (item.quantityChanged > 0) {
        return sum + item.quantityChanged;
      }

      return sum;
    }, 0);
  }

  private calculateOutboundUnits(
    metrics: Array<{ type: string; quantityChanged: number }>,
  ): number {
    return metrics.reduce((sum, item) => {
      if (item.quantityChanged < 0) {
        return sum + Math.abs(item.quantityChanged);
      }

      return sum;
    }, 0);
  }

  private calculateMonthlyGrowthPercent(
    currentMetrics: Array<{ type: string; quantityChanged: number }>,
    previousMetrics: Array<{ type: string; quantityChanged: number }>,
  ): number {
    const currentNet = currentMetrics.reduce(
      (sum, item) => sum + item.quantityChanged,
      0,
    );
    const previousNet = previousMetrics.reduce(
      (sum, item) => sum + item.quantityChanged,
      0,
    );

    if (previousNet === 0) {
      if (currentNet === 0) {
        return 0;
      }

      return 100;
    }

    return Number(
      (((currentNet - previousNet) / Math.abs(previousNet)) * 100).toFixed(1),
    );
  }

  private toInventoryLogItem(log: InventoryLogRecord): InventoryLogItem {
    return {
      id: log.id,
      variantId: log.variantId,
      warehouseId: log.warehouseId,
      type: log.type,
      quantityChanged: log.quantityChanged,
      note: log.note,
      createdAt: log.createdAt.toISOString(),
    };
  }
}
