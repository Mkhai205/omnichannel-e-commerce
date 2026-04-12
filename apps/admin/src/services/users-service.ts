import type {
    AdminUserListResponse,
    AdminUsersFilterRequest,
    AuthUser,
    UpdateUserRoleRequest,
    UpdateUserStatusRequest,
} from "@repo/shared-types";
import { requestApi } from "@/services/http-client";

function requireData<T>(response: { data?: T; message: string; statusCode: number }): T {
    if (!response.data) {
        throw new Error(`Thiếu dữ liệu phản hồi: ${response.message} (${response.statusCode})`);
    }

    return response.data;
}

function buildQuery(params: AdminUsersFilterRequest): string {
    const query = new URLSearchParams();

    if (typeof params.page === "number") query.set("page", String(params.page));
    if (typeof params.limit === "number") query.set("limit", String(params.limit));
    if (params.search) query.set("search", params.search);
    if (params.role) query.set("role", params.role);
    if (params.status) query.set("status", params.status);

    const queryString = query.toString();
    return queryString.length > 0 ? `?${queryString}` : "";
}

export async function getAdminUsers(
    params: AdminUsersFilterRequest = {},
): Promise<AdminUserListResponse> {
    const response = await requestApi<AdminUserListResponse>(`/admin/users${buildQuery(params)}`);
    return requireData(response);
}

export async function getAdminUserById(id: string): Promise<AuthUser> {
    const response = await requestApi<AuthUser>(`/admin/users/${id}`);
    return requireData(response);
}

export async function updateAdminUserStatus(
    id: string,
    payload: UpdateUserStatusRequest,
): Promise<AuthUser> {
    const response = await requestApi<AuthUser>(`/admin/users/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    return requireData(response);
}

export async function updateAdminUserRole(
    id: string,
    payload: UpdateUserRoleRequest,
): Promise<AuthUser> {
    const response = await requestApi<AuthUser>(`/admin/users/${id}/role`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    return requireData(response);
}
