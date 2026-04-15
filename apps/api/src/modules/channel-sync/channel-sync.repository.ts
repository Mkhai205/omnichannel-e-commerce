import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
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

const SUPPORTED_CHANNELS: SalesChannelType[] = [
  'WEB',
  'TIKTOK_MOCK',
  'SHOPEE_MOCK',
];

interface ChannelConnectionStoreRecord extends SellerChannelConnectionItem {
  accessToken?: string | null;
  refreshToken?: string | null;
}

interface ShopChannelStore {
  connections: Map<SalesChannelType, ChannelConnectionStoreRecord>;
  syncRuns: SellerChannelSyncRunItem[];
}

interface UpsertConnectionInput {
  channelType: SalesChannelType;
  status: ChannelConnectionStatus;
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
  private readonly storesByShopId = new Map<string, ShopChannelStore>();

  listConnections(shopId: string): SellerChannelConnectionItem[] {
    const store = this.ensureShopStore(shopId);

    return SUPPORTED_CHANNELS.map((channelType) => {
      const connection = store.connections.get(channelType);
      if (!connection) {
        throw new Error(`Missing channel connection seed for ${channelType}`);
      }

      return this.toPublicConnection(connection);
    });
  }

  findConnection(
    shopId: string,
    channelType: SalesChannelType,
  ): SellerChannelConnectionItem {
    const store = this.ensureShopStore(shopId);
    const connection = store.connections.get(channelType);

    if (!connection) {
      throw new Error(`Missing channel connection for ${channelType}`);
    }

    return this.toPublicConnection(connection);
  }

  upsertConnection(
    shopId: string,
    input: UpsertConnectionInput,
  ): SellerChannelConnectionItem {
    const store = this.ensureShopStore(shopId);
    const nowIso = new Date().toISOString();
    const existing = store.connections.get(input.channelType);

    if (!existing) {
      const seeded = this.createSeededConnection(
        shopId,
        input.channelType,
        nowIso,
      );
      store.connections.set(input.channelType, seeded);
    }

    const connection = store.connections.get(input.channelType);
    if (!connection) {
      throw new Error(
        `Cannot resolve channel connection for ${input.channelType}`,
      );
    }

    connection.status = input.status;
    connection.externalShopId =
      input.externalShopId ?? connection.externalShopId ?? null;
    connection.accessToken =
      input.accessToken ?? connection.accessToken ?? null;
    connection.refreshToken =
      input.refreshToken ?? connection.refreshToken ?? null;
    connection.tokenExpiresAt =
      input.tokenExpiresAt ?? connection.tokenExpiresAt ?? null;
    connection.lastSyncedAt =
      input.lastSyncedAt ?? connection.lastSyncedAt ?? null;
    connection.updatedAt = nowIso;

    return this.toPublicConnection(connection);
  }

  createSyncRun(
    shopId: string,
    input: CreateSyncRunInput,
  ): SellerChannelSyncRunItem {
    const store = this.ensureShopStore(shopId);
    const connection = store.connections.get(input.channelType);
    if (!connection) {
      throw new Error(
        `Cannot resolve channel connection for ${input.channelType}`,
      );
    }

    const nowIso = new Date().toISOString();

    const run: SellerChannelSyncRunItem = {
      id: randomUUID(),
      connectionId: connection.id,
      shopId,
      channelType: input.channelType,
      direction: input.direction,
      trigger: input.trigger,
      status: input.status,
      totalCount: input.totalCount,
      createdCount: input.createdCount,
      updatedCount: input.updatedCount,
      failedCount: input.failedCount,
      message: input.message ?? null,
      startedAt: nowIso,
      finishedAt: nowIso,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    store.syncRuns.unshift(run);

    connection.lastSyncedAt = nowIso;
    connection.updatedAt = nowIso;

    return run;
  }

  listSyncRuns(
    shopId: string,
    filters: {
      page: number;
      limit: number;
      channelType?: SalesChannelType;
      direction?: ChannelSyncDirection;
      status?: ChannelSyncStatus;
    },
  ): SellerChannelSyncRunsResponse {
    const store = this.ensureShopStore(shopId);

    const filteredRuns = store.syncRuns.filter((run) => {
      if (filters.channelType && run.channelType !== filters.channelType) {
        return false;
      }

      if (filters.direction && run.direction !== filters.direction) {
        return false;
      }

      if (filters.status && run.status !== filters.status) {
        return false;
      }

      return true;
    });

    const offset = (filters.page - 1) * filters.limit;
    const data = filteredRuns.slice(offset, offset + filters.limit);
    const totalItems = filteredRuns.length;

    return {
      data,
      meta: {
        page: filters.page,
        limit: filters.limit,
        totalItems,
        totalPages:
          totalItems === 0 ? 0 : Math.ceil(totalItems / filters.limit),
      },
    };
  }

  private ensureShopStore(shopId: string): ShopChannelStore {
    const existing = this.storesByShopId.get(shopId);
    if (existing) {
      return existing;
    }

    const nowIso = new Date().toISOString();
    const seededConnections = new Map<
      SalesChannelType,
      ChannelConnectionStoreRecord
    >();

    for (const channelType of SUPPORTED_CHANNELS) {
      seededConnections.set(
        channelType,
        this.createSeededConnection(shopId, channelType, nowIso),
      );
    }

    const store: ShopChannelStore = {
      connections: seededConnections,
      syncRuns: [],
    };

    this.storesByShopId.set(shopId, store);

    return store;
  }

  private createSeededConnection(
    shopId: string,
    channelType: SalesChannelType,
    nowIso: string,
  ): ChannelConnectionStoreRecord {
    const isWebChannel = channelType === 'WEB';

    return {
      id: randomUUID(),
      shopId,
      channelType,
      status: isWebChannel ? 'CONNECTED' : 'DISCONNECTED',
      externalShopId: null,
      tokenExpiresAt: null,
      lastSyncedAt: null,
      createdAt: nowIso,
      updatedAt: nowIso,
      accessToken: null,
      refreshToken: null,
    };
  }

  private toPublicConnection(
    connection: ChannelConnectionStoreRecord,
  ): SellerChannelConnectionItem {
    return {
      id: connection.id,
      shopId: connection.shopId,
      channelType: connection.channelType,
      status: connection.status,
      externalShopId: connection.externalShopId,
      tokenExpiresAt: connection.tokenExpiresAt,
      lastSyncedAt: connection.lastSyncedAt,
      createdAt: connection.createdAt,
      updatedAt: connection.updatedAt,
    };
  }
}
