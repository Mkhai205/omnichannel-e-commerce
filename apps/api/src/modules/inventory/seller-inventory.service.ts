import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@repo/database';
import type {
  CreateInventoryLogRequest,
  InventoryLogItem,
  InventoryLogsListResponse,
} from '@repo/shared-types';
import type { InventoryLogRecord } from './inventory.repository';
import { InventoryRepository } from './inventory.repository';

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

      if (variant.stockQuantity < quantity) {
        throw new BadRequestException(
          `Requested quantity exceeds stock (${variant.stockQuantity})`,
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
      const updatedVariant = await this.inventoryRepository.updateVariantById(
        variantId,
        {
          stockQuantity: {
            increment: payload.quantityChanged,
          },
        },
        tx,
      );

      if (updatedVariant.stockQuantity < 0) {
        throw new BadRequestException('Stock quantity cannot be negative');
      }

      return this.inventoryRepository.createInventoryLog(
        {
          variantId,
          type: payload.type,
          quantityChanged: payload.quantityChanged,
          note: payload.note?.trim() || null,
        },
        tx,
      );
    });

    return this.toInventoryLogItem(log);
  }

  async getMyVariantInventoryLogs(
    userId: string,
    variantId: string,
    filters: { page?: number; limit?: number },
  ): Promise<InventoryLogsListResponse> {
    await this.ensureSellerShopExists(userId);

    const variant = await this.inventoryRepository.findVariantByIdForSeller(
      userId,
      variantId,
    );

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    const page = this.resolvePage(filters.page);
    const limit = this.resolveLimit(filters.limit);

    const [logs, totalItems] = await Promise.all([
      this.inventoryRepository.findInventoryLogsByVariant(variantId, {
        page,
        limit,
      }),
      this.inventoryRepository.countInventoryLogsByVariant(variantId),
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

  private toInventoryLogItem(log: InventoryLogRecord): InventoryLogItem {
    return {
      id: log.id,
      variantId: log.variantId,
      type: log.type,
      quantityChanged: log.quantityChanged,
      note: log.note,
      createdAt: log.createdAt.toISOString(),
    };
  }
}
