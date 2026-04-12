import type {
    AdminDashboardKpiResponse,
    AdminPaymentsFilterRequest,
    AdminPaymentsListResponse,
    AdminSettlementsFilterRequest,
    AdminSettlementsListResponse,
} from "@repo/shared-types";
import { requestApi } from "@/services/http-client";

function requireData<T>(response: { data?: T; message: string; statusCode: number }): T {
    if (!response.data) {
        throw new Error(`Thiếu dữ liệu phản hồi: ${response.message} (${response.statusCode})`);
    }

    return response.data;
}

function buildPaymentsQuery(params: AdminPaymentsFilterRequest): string {
    const query = new URLSearchParams();

    if (typeof params.page === "number") query.set("page", String(params.page));
    if (typeof params.limit === "number") query.set("limit", String(params.limit));
    if (params.search) query.set("search", params.search);
    if (params.status) query.set("status", params.status);
    if (params.provider) query.set("provider", params.provider);
    if (params.createdFrom) query.set("createdFrom", params.createdFrom);
    if (params.createdTo) query.set("createdTo", params.createdTo);

    const queryString = query.toString();
    return queryString.length > 0 ? `?${queryString}` : "";
}

function buildSettlementsQuery(params: AdminSettlementsFilterRequest): string {
    const query = new URLSearchParams();

    if (typeof params.page === "number") query.set("page", String(params.page));
    if (typeof params.limit === "number") query.set("limit", String(params.limit));
    if (params.search) query.set("search", params.search);
    if (params.status) query.set("status", params.status);
    if (params.settledFrom) query.set("settledFrom", params.settledFrom);
    if (params.settledTo) query.set("settledTo", params.settledTo);

    const queryString = query.toString();
    return queryString.length > 0 ? `?${queryString}` : "";
}

export async function getAdminPayments(
    params: AdminPaymentsFilterRequest = {},
): Promise<AdminPaymentsListResponse> {
    const response = await requestApi<AdminPaymentsListResponse>(
        `/admin/payments${buildPaymentsQuery(params)}`,
    );

    return requireData(response);
}

export async function getAdminSettlements(
    params: AdminSettlementsFilterRequest = {},
): Promise<AdminSettlementsListResponse> {
    const response = await requestApi<AdminSettlementsListResponse>(
        `/admin/settlements${buildSettlementsQuery(params)}`,
    );

    return requireData(response);
}

export async function getAdminDashboardKpi(): Promise<AdminDashboardKpiResponse> {
    const response = await requestApi<AdminDashboardKpiResponse>("/admin/dashboard/kpi");

    return requireData(response);
}
