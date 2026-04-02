import type {
    SellerOrderDetailResponse,
    SellerOrdersFilterRequest,
    SellerOrdersListResponse,
    SellerShippingMetricsResponse,
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

    return params.toString();
}

export async function getSellerShippingOrders(
    filters: SellerOrdersFilterRequest,
): Promise<SellerOrdersListResponse> {
    const query = toQueryString(filters);
    const response = await requestApi<SellerOrdersListResponse>(
        query.length > 0 ? `/seller/orders?${query}` : "/seller/orders",
    );

    return requireData(response);
}

export async function getSellerShippingOrderDetail(
    orderId: string,
): Promise<SellerOrderDetailResponse> {
    const response = await requestApi<SellerOrderDetailResponse>(`/seller/orders/${orderId}`);

    return requireData(response);
}

export async function getSellerShippingMetrics(): Promise<SellerShippingMetricsResponse> {
    const response = await requestApi<SellerShippingMetricsResponse>("/seller/shipping/metrics");

    return requireData(response);
}
