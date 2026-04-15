import type { PaginatedResponse, UUID } from "./common.js";

export type SalesChannelType = "WEB" | "TIKTOK_MOCK" | "SHOPEE_MOCK";

export type ChannelConnectionStatus = "CONNECTED" | "DISCONNECTED" | "EXPIRED" | "ERROR";

export type ChannelSyncDirection = "IMPORT_ORDERS" | "EXPORT_PRODUCTS" | "EXPORT_INVENTORY";

export type ChannelSyncTrigger = "MANUAL" | "CRON";

export type ChannelSyncStatus = "SUCCESS" | "PARTIAL" | "FAILED";

export interface SellerChannelConnectionItem {
    id: UUID;
    shopId: UUID;
    channelType: SalesChannelType;
    status: ChannelConnectionStatus;
    externalShopId?: string | null;
    tokenExpiresAt?: string | null;
    lastSyncedAt?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ConnectSellerChannelRequest {
    externalShopId?: string;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiresAt?: string;
}

export interface ConnectSellerChannelResponse {
    connection: SellerChannelConnectionItem;
}

export interface DisconnectSellerChannelResponse {
    connection: SellerChannelConnectionItem;
}

export interface TriggerChannelSyncRequest {
    direction: ChannelSyncDirection;
    trigger?: ChannelSyncTrigger;
}

export interface SellerChannelSyncRunItem {
    id: UUID;
    connectionId: UUID;
    shopId: UUID;
    channelType: SalesChannelType;
    direction: ChannelSyncDirection;
    trigger: ChannelSyncTrigger;
    status: ChannelSyncStatus;
    totalCount: number;
    createdCount: number;
    updatedCount: number;
    failedCount: number;
    message?: string | null;
    startedAt: string;
    finishedAt?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface TriggerChannelSyncResponse {
    run: SellerChannelSyncRunItem;
}

export interface SellerChannelSyncRunsFilterRequest {
    page?: number;
    limit?: number;
    channelType?: SalesChannelType;
    direction?: ChannelSyncDirection;
    status?: ChannelSyncStatus;
}

export type SellerChannelSyncRunsResponse = PaginatedResponse<SellerChannelSyncRunItem>;
