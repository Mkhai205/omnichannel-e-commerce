import type {
    SellerOrderDetailResponse,
    SellerOrderItem,
    SellerOrdersFilterRequest,
    SellerOrdersListResponse,
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

function toQueryString(filters: SellerOrdersFilterRequest): string {
    const params = new URLSearchParams();

    if (typeof filters.page === "number") {
        params.set("page", String(filters.page));
    }

    if (typeof filters.limit === "number") {
        params.set("limit", String(filters.limit));
    }

    if (filters.status) {
        params.set("status", filters.status);
    }

    if (typeof filters.search === "string" && filters.search.trim().length > 0) {
        params.set("search", filters.search.trim());
    }

    if (typeof filters.placedFrom === "string" && filters.placedFrom.trim().length > 0) {
        params.set("placedFrom", filters.placedFrom);
    }

    if (typeof filters.placedTo === "string" && filters.placedTo.trim().length > 0) {
        params.set("placedTo", filters.placedTo);
    }

    return params.toString();
}

export async function getSellerOrders(
    filters: SellerOrdersFilterRequest,
): Promise<SellerOrdersListResponse> {
    const query = toQueryString(filters);
    const response = await requestApi<SellerOrdersListResponse>(
        query.length > 0 ? `/seller/orders?${query}` : "/seller/orders",
    );

    return requireData(response);
}

export async function getSellerOrderDetail(orderId: string): Promise<SellerOrderDetailResponse> {
    const response = await requestApi<SellerOrderDetailResponse>(`/seller/orders/${orderId}`);
    return requireData(response);
}

export async function markSellerOrderAsProcessing(orderId: string): Promise<SellerOrderItem> {
    const response = await requestApi<SellerOrderItem>(`/seller/orders/${orderId}/processing`, {
        method: "PATCH",
        body: JSON.stringify({}),
    });

    return requireData(response);
}

export async function markSellerOrderAsShipped(orderId: string): Promise<SellerOrderItem> {
    const response = await requestApi<SellerOrderItem>(`/seller/orders/${orderId}/ship`, {
        method: "PATCH",
        body: JSON.stringify({}),
    });

    return requireData(response);
}

export async function markSellerOrderAsDelivered(orderId: string): Promise<SellerOrderItem> {
    const response = await requestApi<SellerOrderItem>(`/seller/orders/${orderId}/deliver`, {
        method: "PATCH",
        body: JSON.stringify({}),
    });

    return requireData(response);
}
