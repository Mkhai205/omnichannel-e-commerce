import type {
    CreateSellerInventoryAdjustmentRequest,
    InventoryLogItem,
    InventoryLogsListResponse,
    SellerInventoryFilterRequest,
    SellerInventoryListResponse,
    SellerInventoryOverview,
    SellerInventoryOverviewFilterRequest,
    SellerWarehouseItem,
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

function toItemsQueryString(filters: SellerInventoryFilterRequest): string {
    const params = new URLSearchParams();

    if (typeof filters.page === "number") {
        params.set("page", String(filters.page));
    }

    if (typeof filters.limit === "number") {
        params.set("limit", String(filters.limit));
    }

    if (filters.search) {
        params.set("search", filters.search);
    }

    if (filters.warehouseId) {
        params.set("warehouseId", filters.warehouseId);
    }

    if (filters.status) {
        params.set("status", filters.status);
    }

    return params.toString();
}

function toOverviewQueryString(filters: SellerInventoryOverviewFilterRequest): string {
    const params = new URLSearchParams();

    if (filters.warehouseId) {
        params.set("warehouseId", filters.warehouseId);
    }

    return params.toString();
}

function toLogsQueryString(filters: {
    page?: number;
    limit?: number;
    warehouseId?: string;
}): string {
    const params = new URLSearchParams();

    if (typeof filters.page === "number") {
        params.set("page", String(filters.page));
    }

    if (typeof filters.limit === "number") {
        params.set("limit", String(filters.limit));
    }

    if (filters.warehouseId) {
        params.set("warehouseId", filters.warehouseId);
    }

    return params.toString();
}

export async function getSellerInventoryWarehouses(): Promise<SellerWarehouseItem[]> {
    const response = await requestApi<SellerWarehouseItem[]>("/seller/inventory/warehouses");
    return requireData(response);
}

export async function getSellerInventoryOverview(
    filters: SellerInventoryOverviewFilterRequest,
): Promise<SellerInventoryOverview> {
    const query = toOverviewQueryString(filters);
    const response = await requestApi<SellerInventoryOverview>(
        query.length > 0 ? `/seller/inventory/overview?${query}` : "/seller/inventory/overview",
    );

    return requireData(response);
}

export async function getSellerInventoryItems(
    filters: SellerInventoryFilterRequest,
): Promise<SellerInventoryListResponse> {
    const query = toItemsQueryString(filters);
    const response = await requestApi<SellerInventoryListResponse>(
        query.length > 0 ? `/seller/inventory/items?${query}` : "/seller/inventory/items",
    );

    return requireData(response);
}

export async function createSellerInventoryAdjustment(
    variantId: string,
    payload: CreateSellerInventoryAdjustmentRequest,
): Promise<InventoryLogItem> {
    const response = await requestApi<InventoryLogItem>(
        `/seller/inventory/variants/${variantId}/adjustments`,
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );

    return requireData(response);
}

export async function getSellerVariantInventoryLogs(
    variantId: string,
    filters: { page?: number; limit?: number; warehouseId?: string },
): Promise<InventoryLogsListResponse> {
    const query = toLogsQueryString(filters);
    const response = await requestApi<InventoryLogsListResponse>(
        query.length > 0
            ? `/seller/catalog/variants/${variantId}/inventory-logs?${query}`
            : `/seller/catalog/variants/${variantId}/inventory-logs`,
    );

    return requireData(response);
}
