import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import type {
  ChannelConnectionStatus,
  ChannelSyncDirection,
  ChannelSyncStatus,
  ChannelSyncTrigger,
  SalesChannelType,
  SellerChannelConnectionItem,
  SellerChannelSyncRunItem,
  SellerChannelSyncRunsResponse,
} from '@repo/shared-types';
import { PrismaService } from '../../infrastructure/database/prisma.service';

const SUPPORTED_CHANNELS: SalesChannelType[] = [
  'WEB',
  'TIKTOK_MOCK',
  'SHOPEE_MOCK',
];

const CHANNEL_CONNECTION_SELECT = {
  id: true,
  shopId: true,
  channelType: true,
  status: true,
  externalShopId: true,
  tokenExpiresAt: true,
  lastSyncedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.SellerChannelConnectionSelect;

const CHANNEL_SYNC_RUN_SELECT = {
  id: true,
  connectionId: true,
  direction: true,
  trigger: true,
  status: true,
  totalCount: true,
  createdCount: true,
  updatedCount: true,
  failedCount: true,
  message: true,
  startedAt: true,
  finishedAt: true,
  createdAt: true,
  updatedAt: true,
  connection: {
    select: {
      shopId: true,
      channelType: true,
    },
  },
} satisfies Prisma.SellerChannelSyncRunSelect;

type ChannelConnectionRecord = Prisma.SellerChannelConnectionGetPayload<{
  select: typeof CHANNEL_CONNECTION_SELECT;
}>;

type ChannelSyncRunRecord = Prisma.SellerChannelSyncRunGetPayload<{
  select: typeof CHANNEL_SYNC_RUN_SELECT;
}>;

interface UpsertConnectionInput {
  channelType: SalesChannelType;
  status?: ChannelConnectionStatus;
  externalShopId?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: string;
  lastSyncedAt?: string;
}

interface CreateSyncRunInput {
  channelType: SalesChannelType;
  direction: ChannelSyncDirection;
  trigger: ChannelSyncTrigger;
  status: ChannelSyncStatus;
  totalCount: number;
  createdCount: number;
  updatedCount: number;
  failedCount: number;
  message?: string;
}

@Injectable()
export class ChannelSyncRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listConnections(
    shopId: string,
  ): Promise<SellerChannelConnectionItem[]> {
    await this.seedDefaultConnectionsForShop(shopId);

    const records = await this.prisma.sellerChannelConnection.findMany({
      where: { shopId },
      select: CHANNEL_CONNECTION_SELECT,
    });

    const channelOrder = new Map(
      SUPPORTED_CHANNELS.map((channelType, index) => [channelType, index]),
    );

    return records
      .sort((left, right) => {
        const leftOrder = channelOrder.get(left.channelType) ?? 0;
        const rightOrder = channelOrder.get(right.channelType) ?? 0;
        return leftOrder - rightOrder;
      })
      .map((record) => this.toPublicConnection(record));
  }

  async findConnection(
    shopId: string,
    channelType: SalesChannelType,
  ): Promise<SellerChannelConnectionItem> {
    await this.seedDefaultConnectionsForShop(shopId);

    const record = await this.prisma.sellerChannelConnection.findUnique({
      where: {
        shopId_channelType: {
          shopId,
          channelType,
        },
      },
      select: CHANNEL_CONNECTION_SELECT,
    });

    if (!record) {
      throw new Error(`Missing channel connection for ${channelType}`);
    }

    return this.toPublicConnection(record);
  }

  async upsertConnection(
    shopId: string,
    input: UpsertConnectionInput,
  ): Promise<SellerChannelConnectionItem> {
    await this.seedDefaultConnectionsForShop(shopId);

    const record = await this.prisma.sellerChannelConnection.upsert({
      where: {
        shopId_channelType: {
          shopId,
          channelType: input.channelType,
        },
      },
      create: {
        shopId,
        channelType: input.channelType,
        status: input.status ?? 'DISCONNECTED',
        externalShopId: input.externalShopId ?? null,
        accessToken: input.accessToken ?? null,
        refreshToken: input.refreshToken ?? null,
        tokenExpiresAt: input.tokenExpiresAt
          ? new Date(input.tokenExpiresAt)
          : null,
        lastSyncedAt: input.lastSyncedAt ? new Date(input.lastSyncedAt) : null,
      },
      update: {
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.externalShopId !== undefined
          ? { externalShopId: input.externalShopId }
          : {}),
        ...(input.accessToken !== undefined
          ? { accessToken: input.accessToken }
          : {}),
        ...(input.refreshToken !== undefined
          ? { refreshToken: input.refreshToken }
          : {}),
        ...(input.tokenExpiresAt !== undefined
          ? {
              tokenExpiresAt: input.tokenExpiresAt
                ? new Date(input.tokenExpiresAt)
                : null,
            }
          : {}),
        ...(input.lastSyncedAt !== undefined
          ? {
              lastSyncedAt: input.lastSyncedAt
                ? new Date(input.lastSyncedAt)
                : null,
            }
          : {}),
      },
      select: CHANNEL_CONNECTION_SELECT,
    });

    return this.toPublicConnection(record);
  }

  async createSyncRun(
    shopId: string,
    input: CreateSyncRunInput,
  ): Promise<SellerChannelSyncRunItem> {
    const connection = await this.findConnection(shopId, input.channelType);

    if (!connection) {
      throw new Error(
        `Cannot resolve channel connection for ${input.channelType}`,
      );
    }

    const now = new Date();

    const run = await this.prisma.$transaction(async (tx) => {
      const createdRun = await tx.sellerChannelSyncRun.create({
        data: {
          connectionId: connection.id,
          direction: input.direction,
          trigger: input.trigger,
          status: input.status,
          totalCount: input.totalCount,
          createdCount: input.createdCount,
          updatedCount: input.updatedCount,
          failedCount: input.failedCount,
          message: input.message ?? null,
          startedAt: now,
          finishedAt: now,
        },
        select: CHANNEL_SYNC_RUN_SELECT,
      });

      await tx.sellerChannelConnection.update({
        where: {
          id: connection.id,
        },
        data: {
          lastSyncedAt: now,
        },
      });

      return createdRun;
    });

    return this.toSyncRunItem(run);
  }

  async listSyncRuns(
    shopId: string,
    filters: {
      page: number;
      limit: number;
      channelType?: SalesChannelType;
      direction?: ChannelSyncDirection;
      status?: ChannelSyncStatus;
    },
  ): Promise<SellerChannelSyncRunsResponse> {
    await this.seedDefaultConnectionsForShop(shopId);

    const where: Prisma.SellerChannelSyncRunWhereInput = {
      connection: {
        shopId,
        ...(filters.channelType ? { channelType: filters.channelType } : {}),
      },
      ...(filters.direction ? { direction: filters.direction } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    };

    const [records, totalItems] = await Promise.all([
      this.prisma.sellerChannelSyncRun.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        select: CHANNEL_SYNC_RUN_SELECT,
      }),
      this.prisma.sellerChannelSyncRun.count({ where }),
    ]);

    return {
      data: records.map((record) => this.toSyncRunItem(record)),
      meta: {
        page: filters.page,
        limit: filters.limit,
        totalItems,
        totalPages:
          totalItems === 0 ? 0 : Math.ceil(totalItems / filters.limit),
      },
    };
  }

  private async seedDefaultConnectionsForShop(shopId: string): Promise<void> {
    await this.prisma.sellerChannelConnection.createMany({
      data: SUPPORTED_CHANNELS.map((channelType) => ({
        shopId,
        channelType,
        status: channelType === 'WEB' ? 'CONNECTED' : 'DISCONNECTED',
      })),
      skipDuplicates: true,
    });
  }

  private toPublicConnection(
    connection: ChannelConnectionRecord,
  ): SellerChannelConnectionItem {
    return {
      id: connection.id,
      shopId: connection.shopId,
      channelType: connection.channelType,
      status: connection.status,
      externalShopId: connection.externalShopId,
      tokenExpiresAt: connection.tokenExpiresAt?.toISOString() ?? null,
      lastSyncedAt: connection.lastSyncedAt?.toISOString() ?? null,
      createdAt: connection.createdAt.toISOString(),
      updatedAt: connection.updatedAt.toISOString(),
    };
  }

  private toSyncRunItem(
    record: ChannelSyncRunRecord,
  ): SellerChannelSyncRunItem {
    return {
      id: record.id,
      connectionId: record.connectionId,
      shopId: record.connection.shopId,
      channelType: record.connection.channelType,
      direction: record.direction,
      trigger: record.trigger,
      status: record.status,
      totalCount: record.totalCount,
      createdCount: record.createdCount,
      updatedCount: record.updatedCount,
      failedCount: record.failedCount,
      message: record.message,
      startedAt: record.startedAt.toISOString(),
      finishedAt: record.finishedAt?.toISOString() ?? null,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }
}
