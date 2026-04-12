import type {
    AdminProductsFilterRequest,
    AdminProductsListResponse,
    ProductItem,
    UpdateProductStatusRequest,
} from "@repo/shared-types";
import { requestApi } from "@/services/http-client";

function requireData<T>(response: { data?: T; message: string; statusCode: number }): T {
    if (!response.data) {
        throw new Error(`Thiếu dữ liệu phản hồi: ${response.message} (${response.statusCode})`);
    }

    return response.data;
}

function buildQuery(params: AdminProductsFilterRequest): string {
    const query = new URLSearchParams();

    if (typeof params.page === "number") query.set("page", String(params.page));
    if (typeof params.limit === "number") query.set("limit", String(params.limit));
    if (params.search) query.set("search", params.search);
    if (params.status) query.set("status", params.status);
    if (params.categoryId) query.set("categoryId", params.categoryId);
    if (params.shopId) query.set("shopId", params.shopId);

    const queryString = query.toString();
    return queryString.length > 0 ? `?${queryString}` : "";
}

export async function getAdminProducts(
    params: AdminProductsFilterRequest = {},
): Promise<AdminProductsListResponse> {
    const response = await requestApi<AdminProductsListResponse>(
        `/admin/catalog/products${buildQuery(params)}`,
    );

    return requireData(response);
}

export async function updateAdminProductStatus(
    id: string,
    payload: UpdateProductStatusRequest,
): Promise<ProductItem> {
    const response = await requestApi<ProductItem>(`/admin/catalog/products/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    return requireData(response);
}
