import type {
    ConnectSellerChannelRequest,
    ConnectSellerChannelResponse,
    DisconnectSellerChannelResponse,
    SalesChannelType,
    SellerChannelProductSyncStatusesRequest,
    SellerChannelProductSyncStatusesResponse,
    SellerChannelConnectionItem,
    SellerChannelSyncRunsFilterRequest,
    SellerChannelSyncRunsResponse,
    SyncProductToChannelsRequest,
    SyncProductToChannelsResponse,
    TriggerChannelSyncRequest,
    TriggerChannelSyncResponse,
} from "@repo/shared-types";
import { ApiRequestError, requestApi } from "@/services/http-client";

function requireData<T>(response: { data?: T; message: string; statusCode: number }): T {
    if (!response.data) {
        throw new ApiRequestError(
            `Missing response data: ${response.message}`,
            response.statusCode,
            response,
        );
    }

    return response.data;
}

function toSyncRunsQueryString(filters: SellerChannelSyncRunsFilterRequest): string {
    const params = new URLSearchParams();

    if (typeof filters.page === "number") {
        params.set("page", String(filters.page));
    }

    if (typeof filters.limit === "number") {
        params.set("limit", String(filters.limit));
    }

    if (filters.channelType) {
        params.set("channelType", filters.channelType);
    }

    if (filters.direction) {
        params.set("direction", filters.direction);
    }

    if (filters.status) {
        params.set("status", filters.status);
    }

    return params.toString();
}

export async function getSellerChannels(): Promise<SellerChannelConnectionItem[]> {
    const response = await requestApi<SellerChannelConnectionItem[]>("/seller/channels");

    return requireData(response);
}

export async function connectSellerChannel(
    channelType: SalesChannelType,
    payload: ConnectSellerChannelRequest,
): Promise<ConnectSellerChannelResponse> {
    const response = await requestApi<ConnectSellerChannelResponse>(
        `/seller/channels/${channelType}/connect`,
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );

    return requireData(response);
}

export async function disconnectSellerChannel(
    channelType: SalesChannelType,
): Promise<DisconnectSellerChannelResponse> {
    const response = await requestApi<DisconnectSellerChannelResponse>(
        `/seller/channels/${channelType}/disconnect`,
        {
            method: "POST",
            body: JSON.stringify({}),
        },
    );

    return requireData(response);
}

export async function triggerSellerChannelSync(
    channelType: SalesChannelType,
    payload: TriggerChannelSyncRequest,
): Promise<TriggerChannelSyncResponse> {
    const response = await requestApi<TriggerChannelSyncResponse>(
        `/seller/channels/${channelType}/sync`,
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );

    return requireData(response);
}

export async function getSellerChannelSyncRuns(
    filters: SellerChannelSyncRunsFilterRequest,
): Promise<SellerChannelSyncRunsResponse> {
    const query = toSyncRunsQueryString(filters);

    const response = await requestApi<SellerChannelSyncRunsResponse>(
        query.length > 0 ? `/seller/channels/sync-runs?${query}` : "/seller/channels/sync-runs",
    );

    return requireData(response);
}

export async function syncSellerProductToChannels(
    payload: SyncProductToChannelsRequest,
): Promise<SyncProductToChannelsResponse> {
    const response = await requestApi<SyncProductToChannelsResponse>(
        "/seller/channels/products/sync",
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );

    return requireData(response);
}

export async function getSellerProductChannelSyncStatuses(
    payload: SellerChannelProductSyncStatusesRequest,
): Promise<SellerChannelProductSyncStatusesResponse> {
    const response = await requestApi<SellerChannelProductSyncStatusesResponse>(
        "/seller/channels/products/sync-statuses",
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );

    return requireData(response);
}
