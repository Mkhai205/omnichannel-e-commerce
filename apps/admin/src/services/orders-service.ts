import type {
    AdminOrderDetailResponse,
    AdminOrdersFilterRequest,
    AdminOrdersListResponse,
} from "@repo/shared-types";
import { requestApi } from "@/services/http-client";

function requireData<T>(response: { data?: T; message: string; statusCode: number }): T {
    if (!response.data) {
        throw new Error(`Missing response data: ${response.message} (${response.statusCode})`);
    }

    return response.data;
}

function buildQuery(params: AdminOrdersFilterRequest): string {
    const query = new URLSearchParams();

    if (typeof params.page === "number") query.set("page", String(params.page));
    if (typeof params.limit === "number") query.set("limit", String(params.limit));
    if (params.search) query.set("search", params.search);
    if (params.status) query.set("status", params.status);
    if (params.settlementStatus) query.set("settlementStatus", params.settlementStatus);
    if (params.placedFrom) query.set("placedFrom", params.placedFrom);
    if (params.placedTo) query.set("placedTo", params.placedTo);

    const queryString = query.toString();
    return queryString.length > 0 ? `?${queryString}` : "";
}

export async function getAdminOrders(
    params: AdminOrdersFilterRequest = {},
): Promise<AdminOrdersListResponse> {
    const response = await requestApi<AdminOrdersListResponse>(
        `/admin/orders${buildQuery(params)}`,
    );
    return requireData(response);
}

export async function getAdminOrderDetail(orderId: string): Promise<AdminOrderDetailResponse> {
    const response = await requestApi<AdminOrderDetailResponse>(`/admin/orders/${orderId}`);
    return requireData(response);
}
