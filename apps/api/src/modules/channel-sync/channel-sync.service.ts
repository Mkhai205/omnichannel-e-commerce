import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type {
  ChannelSyncDirection,
  ChannelSyncStatus,
  ConnectSellerChannelRequest,
  ConnectSellerChannelResponse,
  DisconnectSellerChannelResponse,
  ProductChannelSyncStatus,
  SalesChannelType,
  SellerChannelConnectionItem,
  SellerChannelProductSyncStatusesRequest,
  SellerChannelProductSyncStatusesResponse,
  SellerChannelSyncRunsFilterRequest,
  SellerChannelSyncRunsResponse,
  SyncProductToChannelsRequest,
  SyncProductToChannelsResponse,
  TriggerChannelSyncRequest,
  TriggerChannelSyncResponse,
} from '@repo/shared-types';
import type { Prisma } from '@repo/database';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { ChannelSyncRepository } from './channel-sync.repository';

interface SyncRunOutcome {
  status: ChannelSyncStatus;
  totalCount: number;
  createdCount: number;
  updatedCount: number;
  failedCount: number;
  message: string;
}

interface ImportedOrderCandidate {
  externalOrderId: string;
  note: string;
  items: Array<{
    variantId: string;
    externalSku: string;
    unitPrice: string;
    quantity: number;
  }>;
  rawPayload: Prisma.InputJsonValue;
}

@Injectable()
export class ChannelSyncService {
  private readonly logger = new Logger(ChannelSyncService.name);

  constructor(
    private readonly channelSyncRepository: ChannelSyncRepository,
    private readonly prisma: PrismaService,
  ) {}

  async getMyChannelConnections(
    userId: string,
  ): Promise<SellerChannelConnectionItem[]> {
    const shopId = await this.resolveSellerShopId(userId);
    return this.channelSyncRepository.listConnections(shopId);
  }

  async connectMyChannel(
    userId: string,
    channelType: SalesChannelType,
    payload: ConnectSellerChannelRequest,
  ): Promise<ConnectSellerChannelResponse> {
    const shopId = await this.resolveSellerShopId(userId);

    if (channelType === 'WEB') {
      throw new BadRequestException(
        'WEB channel is managed internally and always connected',
      );
    }

    const connection = await this.channelSyncRepository.upsertConnection(
      shopId,
      {
        channelType,
        status: 'CONNECTED',
        externalShopId: payload.externalShopId,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        tokenExpiresAt: payload.tokenExpiresAt,
      },
    );

    this.logger.log(
      `[CHANNEL_SYNC] seller=${userId} shop=${shopId} channel=${channelType} action=connect`,
    );

    return {
      connection,
    };
  }

  async disconnectMyChannel(
    userId: string,
    channelType: SalesChannelType,
  ): Promise<DisconnectSellerChannelResponse> {
    const shopId = await this.resolveSellerShopId(userId);

    if (channelType === 'WEB') {
      throw new BadRequestException('WEB channel cannot be disconnected');
    }

    const existing = await this.channelSyncRepository.findConnection(
      shopId,
      channelType,
    );
    if (existing.status === 'DISCONNECTED') {
      return {
        connection: existing,
      };
    }

    const connection = await this.channelSyncRepository.upsertConnection(
      shopId,
      {
        channelType,
        status: 'DISCONNECTED',
      },
    );

    this.logger.log(
      `[CHANNEL_SYNC] seller=${userId} shop=${shopId} channel=${channelType} action=disconnect`,
    );

    return {
      connection,
    };
  }

  async triggerMyChannelSync(
    userId: string,
    channelType: SalesChannelType,
    payload: TriggerChannelSyncRequest,
  ): Promise<TriggerChannelSyncResponse> {
    const shopId = await this.resolveSellerShopId(userId);
    const connection = await this.channelSyncRepository.findConnection(
      shopId,
      channelType,
    );

    if (channelType !== 'WEB' && connection.status !== 'CONNECTED') {
      throw new BadRequestException(
        'Channel must be connected before triggering sync',
      );
    }

    const outcome =
      payload.direction === 'IMPORT_ORDERS'
        ? await this.importOrdersFromMockChannel(
            shopId,
            connection,
            channelType,
          )
        : this.simulateSyncOutcome(channelType, payload.direction);

    const run = await this.channelSyncRepository.createSyncRun(shopId, {
      channelType,
      direction: payload.direction,
      trigger: payload.trigger ?? 'MANUAL',
      status: outcome.status,
      totalCount: outcome.totalCount,
      createdCount: outcome.createdCount,
      updatedCount: outcome.updatedCount,
      failedCount: outcome.failedCount,
      message: outcome.message,
    });

    this.logger.log(
      `[CHANNEL_SYNC] seller=${userId} shop=${shopId} channel=${channelType} direction=${payload.direction} status=${run.status}`,
    );

    return {
      run,
    };
  }

  async getMyChannelSyncRuns(
    userId: string,
    filters: SellerChannelSyncRunsFilterRequest,
  ): Promise<SellerChannelSyncRunsResponse> {
    const shopId = await this.resolveSellerShopId(userId);

    return this.channelSyncRepository.listSyncRuns(shopId, {
      page: this.resolvePage(filters.page),
      limit: this.resolveLimit(filters.limit),
      channelType: filters.channelType,
      direction: filters.direction,
      status: filters.status,
    });
  }

  async syncMyProductToChannels(
    userId: string,
    payload: SyncProductToChannelsRequest,
  ): Promise<SyncProductToChannelsResponse> {
    const shopId = await this.resolveSellerShopId(userId);
    const product = await this.prisma.product.findFirst({
      where: {
        id: payload.productId,
        shopId,
      },
      select: {
        id: true,
        variants: {
          select: {
            id: true,
            sku: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const uniqueChannels = Array.from(new Set(payload.channelTypes));
    const results: SyncProductToChannelsResponse['results'] = [];

    for (const channelType of uniqueChannels) {
      if (channelType === 'WEB') {
        results.push({
          channelType,
          channelConnected: true,
          status: 'INTERNAL_SOURCE',
          totalVariantCount: product.variants.length,
          mappedVariantCount: product.variants.length,
          message: 'WEB channel is internal source and does not require export',
        });
        continue;
      }

      const connection = await this.channelSyncRepository.findConnection(
        shopId,
        channelType,
      );
      if (connection.status !== 'CONNECTED') {
        results.push({
          channelType,
          channelConnected: false,
          status: 'NOT_SYNCED',
          totalVariantCount: product.variants.length,
          mappedVariantCount: 0,
          message: 'Channel must be connected before syncing products',
        });
        continue;
      }

      const outcome = await this.channelSyncRepository.upsertProductMappings(
        connection.id,
        {
          channelType,
          productId: product.id,
          variants: product.variants,
        },
      );

      const runStatus: ChannelSyncStatus =
        outcome.failedCount === 0
          ? 'SUCCESS'
          : outcome.mappedVariantCount > 0
            ? 'PARTIAL'
            : 'FAILED';
      const runMessage =
        runStatus === 'SUCCESS'
          ? `Exported ${outcome.mappedVariantCount}/${outcome.totalCount} variants`
          : `Exported ${outcome.mappedVariantCount}/${outcome.totalCount} variants with ${outcome.failedCount} failures`;

      const run = await this.channelSyncRepository.createSyncRun(shopId, {
        channelType,
        direction: 'EXPORT_PRODUCTS',
        trigger: 'MANUAL',
        status: runStatus,
        totalCount: outcome.totalCount,
        createdCount: outcome.createdCount,
        updatedCount: outcome.updatedCount,
        failedCount: outcome.failedCount,
        message: runMessage,
      });

      results.push({
        channelType,
        channelConnected: true,
        status: this.toProductSyncStatus(
          outcome.totalCount,
          outcome.mappedVariantCount,
        ),
        totalVariantCount: outcome.totalCount,
        mappedVariantCount: outcome.mappedVariantCount,
        message: runMessage,
        run,
      });

      this.logger.log(
        `[CHANNEL_SYNC] seller=${userId} shop=${shopId} product=${product.id} channel=${channelType} action=export-products status=${runStatus}`,
      );
    }

    return {
      productId: product.id,
      results,
    };
  }

  async getMyProductChannelSyncStatuses(
    userId: string,
    payload: SellerChannelProductSyncStatusesRequest,
  ): Promise<SellerChannelProductSyncStatusesResponse> {
    const shopId = await this.resolveSellerShopId(userId);
    const productIds = Array.from(new Set(payload.productIds));

    if (productIds.length === 0) {
      return {
        items: [],
      };
    }

    const products = await this.prisma.product.findMany({
      where: {
        shopId,
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        variants: {
          select: {
            id: true,
          },
        },
      },
    });

    if (payload.channelType === 'WEB') {
      return {
        items: products.map((product) => ({
          productId: product.id,
          channelType: payload.channelType,
          channelConnected: true,
          status: 'INTERNAL_SOURCE',
          totalVariantCount: product.variants.length,
          mappedVariantCount: product.variants.length,
        })),
      };
    }

    const connection = await this.channelSyncRepository.findConnection(
      shopId,
      payload.channelType,
    );
    const isChannelConnected = connection.status === 'CONNECTED';

    const allVariantIds = products.flatMap((product) =>
      product.variants.map((variant) => variant.id),
    );
    const mappedVariantIdSet =
      await this.channelSyncRepository.getMappedVariantIds(
        connection.id,
        allVariantIds,
      );

    return {
      items: products.map((product) => {
        const totalVariantCount = product.variants.length;
        const mappedVariantCount = product.variants.reduce(
          (total, variant) =>
            total + (mappedVariantIdSet.has(variant.id) ? 1 : 0),
          0,
        );

        return {
          productId: product.id,
          channelType: payload.channelType,
          channelConnected: isChannelConnected,
          status: this.toProductSyncStatus(
            totalVariantCount,
            mappedVariantCount,
          ),
          totalVariantCount,
          mappedVariantCount,
        };
      }),
    };
  }

  private async resolveSellerShopId(userId: string): Promise<string> {
    const sellerShop = await this.prisma.shop.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!sellerShop) {
      throw new NotFoundException('Seller shop not found');
    }

    return sellerShop.id;
  }

  private resolvePage(page?: number): number {
    if (!page || Number.isNaN(page) || page < 1) {
      return 1;
    }

    return Math.floor(page);
  }

  private resolveLimit(limit?: number): number {
    if (!limit || Number.isNaN(limit)) {
      return 20;
    }

    const normalized = Math.floor(limit);
    if (normalized < 1) {
      return 1;
    }

    if (normalized > 100) {
      return 100;
    }

    return normalized;
  }

  private simulateSyncOutcome(
    channelType: SalesChannelType,
    direction: ChannelSyncDirection,
  ): SyncRunOutcome {
    if (direction === 'IMPORT_ORDERS') {
      if (channelType === 'WEB') {
        return {
          status: 'SUCCESS',
          totalCount: 0,
          createdCount: 0,
          updatedCount: 0,
          failedCount: 0,
          message: 'WEB channel uses native orders and does not need import',
        };
      }

      if (channelType === 'TIKTOK_MOCK') {
        return {
          status: 'PARTIAL',
          totalCount: 12,
          createdCount: 8,
          updatedCount: 3,
          failedCount: 1,
          message: 'Imported TikTok mock orders with one invalid payload',
        };
      }

      return {
        status: 'PARTIAL',
        totalCount: 10,
        createdCount: 6,
        updatedCount: 2,
        failedCount: 2,
        message: 'Imported Shopee mock orders with two duplicate external ids',
      };
    }

    if (direction === 'EXPORT_PRODUCTS') {
      return {
        status: 'SUCCESS',
        totalCount: 9,
        createdCount: 9,
        updatedCount: 0,
        failedCount: 0,
        message: 'Exported product catalog to mock channel successfully',
      };
    }

    return {
      status: 'SUCCESS',
      totalCount: 17,
      createdCount: 0,
      updatedCount: 17,
      failedCount: 0,
      message:
        'Exported latest inventory snapshot to mock channel successfully',
    };
  }

  private toProductSyncStatus(
    totalVariantCount: number,
    mappedVariantCount: number,
  ): ProductChannelSyncStatus {
    if (totalVariantCount <= 0 || mappedVariantCount <= 0) {
      return 'NOT_SYNCED';
    }

    if (mappedVariantCount >= totalVariantCount) {
      return 'SYNCED';
    }

    return 'PARTIAL';
  }

  private async importOrdersFromMockChannel(
    shopId: string,
    connection: SellerChannelConnectionItem,
    channelType: SalesChannelType,
  ): Promise<SyncRunOutcome> {
    if (channelType === 'WEB') {
      return {
        status: 'SUCCESS',
        totalCount: 0,
        createdCount: 0,
        updatedCount: 0,
        failedCount: 0,
        message: 'WEB channel uses native orders and does not need import',
      };
    }

    const mappedVariants =
      await this.prisma.sellerChannelProductMapping.findMany({
        where: {
          connectionId: connection.id,
          isActive: true,
          variant: {
            stockQuantity: {
              gt: 0,
            },
            product: {
              shopId,
            },
          },
        },
        select: {
          externalSku: true,
          variant: {
            select: {
              id: true,
              sku: true,
              price: true,
              stockQuantity: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 24,
      });

    if (mappedVariants.length === 0) {
      return {
        status: 'FAILED',
        totalCount: 0,
        createdCount: 0,
        updatedCount: 0,
        failedCount: 0,
        message:
          'No active product mappings with available stock. Export products first.',
      };
    }

    const buyer = await this.getOrCreateSimulationBuyer(shopId, channelType);
    const importedOrders = this.buildImportedOrderCandidates(
      channelType,
      mappedVariants,
    );

    let createdCount = 0;
    let updatedCount = 0;
    let failedCount = 0;

    for (const orderCandidate of importedOrders) {
      try {
        const result = await this.prisma.$transaction(async (tx) => {
          const existingOrderMapping =
            await tx.sellerChannelOrderMapping.findUnique({
              where: {
                connectionId_externalOrderId: {
                  connectionId: connection.id,
                  externalOrderId: orderCandidate.externalOrderId,
                },
              },
              select: {
                id: true,
              },
            });

          if (existingOrderMapping) {
            return 'SKIPPED' as const;
          }

          let subtotalCents = 0n;

          for (const item of orderCandidate.items) {
            const deducted = await tx.productVariant.updateMany({
              where: {
                id: item.variantId,
                stockQuantity: {
                  gte: item.quantity,
                },
              },
              data: {
                stockQuantity: {
                  decrement: item.quantity,
                },
              },
            });

            if (deducted.count !== 1) {
              throw new Error(
                `Insufficient stock for variant ${item.variantId}`,
              );
            }

            subtotalCents +=
              this.parseMoneyToCents(item.unitPrice) * BigInt(item.quantity);
          }

          const normalizedSubtotal = this.formatCents(
            this.normalizeToWholeVndCents(subtotalCents),
          );
          const createdOrder = await tx.order.create({
            data: {
              orderNumber: this.generateChannelOrderNumber(shopId, channelType),
              userId: buyer.userId,
              shopId,
              shippingAddressId: buyer.addressId,
              status: 'PAID',
              subtotal: normalizedSubtotal,
              totalAmount: normalizedSubtotal,
              note: orderCandidate.note,
              sourceChannelType: channelType,
              sourceChannelConnectionId: connection.id,
            },
            select: {
              id: true,
            },
          });

          for (const item of orderCandidate.items) {
            const lineTotalCents =
              this.parseMoneyToCents(item.unitPrice) * BigInt(item.quantity);

            await tx.orderItem.create({
              data: {
                orderId: createdOrder.id,
                variantId: item.variantId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                lineTotal: this.formatCents(lineTotalCents),
              },
              select: {
                id: true,
              },
            });
          }

          await tx.sellerChannelOrderMapping.create({
            data: {
              connectionId: connection.id,
              externalOrderId: orderCandidate.externalOrderId,
              orderId: createdOrder.id,
              rawPayload: orderCandidate.rawPayload,
            },
            select: {
              id: true,
            },
          });

          return 'CREATED' as const;
        });

        if (result === 'SKIPPED') {
          updatedCount += 1;
        } else {
          createdCount += 1;
        }
      } catch (error) {
        failedCount += 1;
        const reason = error instanceof Error ? error.message : 'Unknown error';
        this.logger.warn(
          `[CHANNEL_SYNC_IMPORT] shop=${shopId} channel=${channelType} externalOrderId=${orderCandidate.externalOrderId} status=failed reason=${reason}`,
        );
      }
    }

    const totalCount = importedOrders.length;
    const completedCount = createdCount + updatedCount;

    if (failedCount === 0) {
      return {
        status: 'SUCCESS',
        totalCount,
        createdCount,
        updatedCount,
        failedCount,
        message:
          createdCount > 0
            ? `Imported ${createdCount}/${totalCount} orders from ${channelType}`
            : `No new orders imported from ${channelType}; all ${totalCount} orders already existed`,
      };
    }

    if (completedCount === 0) {
      return {
        status: 'FAILED',
        totalCount,
        createdCount,
        updatedCount,
        failedCount,
        message: `Failed to import all ${totalCount} orders from ${channelType}`,
      };
    }

    return {
      status: 'PARTIAL',
      totalCount,
      createdCount,
      updatedCount,
      failedCount,
      message: `Imported ${completedCount}/${totalCount} orders from ${channelType} with ${failedCount} failures`,
    };
  }

  private buildImportedOrderCandidates(
    channelType: SalesChannelType,
    mappedVariants: Array<{
      externalSku: string;
      variant: {
        id: string;
        sku: string;
        price: unknown;
        stockQuantity: number;
      };
    }>,
  ): ImportedOrderCandidate[] {
    const orderCount = Math.min(
      3,
      Math.max(1, Math.ceil(mappedVariants.length / 3)),
    );
    const seed = Date.now().toString(36).toUpperCase();

    const orders: ImportedOrderCandidate[] = [];

    for (let orderIndex = 0; orderIndex < orderCount; orderIndex += 1) {
      const primaryVariant =
        mappedVariants[(orderIndex * 2) % mappedVariants.length];
      const secondaryVariant =
        mappedVariants[(orderIndex * 2 + 1) % mappedVariants.length];
      const itemCandidates =
        primaryVariant.variant.id === secondaryVariant.variant.id
          ? [primaryVariant]
          : [primaryVariant, secondaryVariant];

      const items = itemCandidates.map((candidate, itemIndex) => {
        const quantity =
          candidate.variant.stockQuantity >= 3 && itemIndex === 0 ? 2 : 1;

        return {
          variantId: candidate.variant.id,
          externalSku: candidate.externalSku,
          unitPrice: this.normalizeMoney(String(candidate.variant.price)),
          quantity,
        };
      });

      const externalOrderId = `${channelType}-${seed}-${String(orderIndex + 1).padStart(2, '0')}`;

      orders.push({
        externalOrderId,
        note: `Imported from ${channelType} simulation #${orderIndex + 1}`,
        items,
        rawPayload: {
          externalOrderId,
          channelType,
          importedAt: new Date().toISOString(),
          items: items.map((item) => ({
            externalSku: item.externalSku,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      });
    }

    return orders;
  }

  private async getOrCreateSimulationBuyer(
    shopId: string,
    channelType: SalesChannelType,
  ): Promise<{ userId: string; addressId: string }> {
    const email = `sim.${channelType.toLowerCase()}.${shopId.replace(/-/g, '').slice(0, 10)}@internal.local`;
    const fullName = `Simulation Buyer ${channelType}`;

    const user = await this.prisma.user.upsert({
      where: {
        email,
      },
      create: {
        email,
        fullName,
        role: 'CUSTOMER',
        status: 'ACTIVE',
      },
      update: {
        fullName,
      },
      select: {
        id: true,
      },
    });

    const existingAddress = await this.prisma.address.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
      },
    });

    if (existingAddress) {
      return {
        userId: user.id,
        addressId: existingAddress.id,
      };
    }

    const createdAddress = await this.prisma.address.create({
      data: {
        userId: user.id,
        type: 'HOME',
        recipientName: fullName,
        recipientPhone: '0900000000',
        streetAddress: '123 Simulation Street',
        wardDistrict: 'Ward 1',
        city: 'Ho Chi Minh City',
        state: 'Ho Chi Minh',
        postalCode: '700000',
        country: 'Vietnam',
        isDefault: true,
      },
      select: {
        id: true,
      },
    });

    return {
      userId: user.id,
      addressId: createdAddress.id,
    };
  }

  private normalizeMoney(value: string): string {
    return this.formatCents(
      this.normalizeToWholeVndCents(this.parseMoneyToCents(value)),
    );
  }

  private normalizeToWholeVndCents(cents: bigint): bigint {
    const remainder = cents % 100n;

    if (remainder === 0n) {
      return cents;
    }

    if (remainder >= 50n) {
      return cents + (100n - remainder);
    }

    return cents - remainder;
  }

  private parseMoneyToCents(value: string): bigint {
    const trimmed = value.trim();

    if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
      throw new Error('Invalid money value');
    }

    const [whole, fraction = ''] = trimmed.split('.');
    const normalizedFraction = `${fraction}00`.slice(0, 2);

    return BigInt(whole) * 100n + BigInt(normalizedFraction);
  }

  private formatCents(cents: bigint): string {
    const whole = cents / 100n;
    const fraction = (cents % 100n).toString().padStart(2, '0');

    return `${whole.toString()}.${fraction}`;
  }

  private generateChannelOrderNumber(
    shopId: string,
    channelType: SalesChannelType,
  ): string {
    const timestamp = Date.now().toString();
    const shopSuffix = shopId.replace(/-/g, '').slice(-4).toUpperCase();
    const channelPrefix = channelType.split('_')[0];
    const randomPart = Math.random().toString(16).slice(2, 8).toUpperCase();

    return `CHN-${channelPrefix}-${timestamp}-${shopSuffix}${randomPart}`;
  }
}
