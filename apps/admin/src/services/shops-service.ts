import type {
    AdminShopItem,
    AdminShopsFilterRequest,
    AdminShopsListResponse,
    AdminUpdateShopStatusRequest,
} from "@repo/shared-types";
import { requestApi } from "@/services/http-client";

function requireData<T>(response: { data?: T; message: string; statusCode: number }): T {
    if (!response.data) {
        throw new Error(`Missing response data: ${response.message} (${response.statusCode})`);
    }

    return response.data;
}

function buildQuery(params: AdminShopsFilterRequest): string {
    const query = new URLSearchParams();

    if (typeof params.page === "number") query.set("page", String(params.page));
    if (typeof params.limit === "number") query.set("limit", String(params.limit));
    if (params.search) query.set("search", params.search);
    if (params.status) query.set("status", params.status);

    const queryString = query.toString();
    return queryString.length > 0 ? `?${queryString}` : "";
}

export async function getAdminShops(
    params: AdminShopsFilterRequest = {},
): Promise<AdminShopsListResponse> {
    const response = await requestApi<AdminShopsListResponse>(`/admin/shops${buildQuery(params)}`);
    return requireData(response);
}

export async function getAdminShopById(id: string): Promise<AdminShopItem> {
    const response = await requestApi<AdminShopItem>(`/admin/shops/${id}`);
    return requireData(response);
}

export async function updateAdminShopStatus(
    id: string,
    payload: AdminUpdateShopStatusRequest,
): Promise<AdminShopItem> {
    const response = await requestApi<AdminShopItem>(`/admin/shops/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    return requireData(response);
}
