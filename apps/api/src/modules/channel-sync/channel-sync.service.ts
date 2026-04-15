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
  SalesChannelType,
  SellerChannelConnectionItem,
  SellerChannelSyncRunsFilterRequest,
  SellerChannelSyncRunsResponse,
  TriggerChannelSyncRequest,
  TriggerChannelSyncResponse,
} from '@repo/shared-types';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { ChannelSyncRepository } from './channel-sync.repository';

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

    const connection = this.channelSyncRepository.upsertConnection(shopId, {
      channelType,
      status: 'CONNECTED',
      externalShopId: payload.externalShopId,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      tokenExpiresAt: payload.tokenExpiresAt,
    });

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

    const existing = this.channelSyncRepository.findConnection(
      shopId,
      channelType,
    );
    if (existing.status === 'DISCONNECTED') {
      return {
        connection: existing,
      };
    }

    const connection = this.channelSyncRepository.upsertConnection(shopId, {
      channelType,
      status: 'DISCONNECTED',
    });

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
    const connection = this.channelSyncRepository.findConnection(
      shopId,
      channelType,
    );

    if (channelType !== 'WEB' && connection.status !== 'CONNECTED') {
      throw new BadRequestException(
        'Channel must be connected before triggering sync',
      );
    }

    const outcome = this.simulateSyncOutcome(channelType, payload.direction);

    const run = this.channelSyncRepository.createSyncRun(shopId, {
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
  ): {
    status: ChannelSyncStatus;
    totalCount: number;
    createdCount: number;
    updatedCount: number;
    failedCount: number;
    message: string;
  } {
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
}
