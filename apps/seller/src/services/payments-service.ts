import type {
    SellerAnalyticsFilterRequest,
    SellerAnalyticsResponse,
    SellerPaymentsFilterRequest,
    SellerPaymentsOverviewResponse,
    SellerPaymentsTransactionsResponse,
    SellerWalletSummaryResponse,
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

function toQueryString(filters: SellerPaymentsFilterRequest): string {
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

export async function getSellerWalletSummary(): Promise<SellerWalletSummaryResponse> {
    const response = await requestApi<SellerWalletSummaryResponse>("/seller/payments/wallet");

    return requireData(response);
}

export async function getSellerPaymentsOverview(): Promise<SellerPaymentsOverviewResponse> {
    const response = await requestApi<SellerPaymentsOverviewResponse>("/seller/payments/overview");

    return requireData(response);
}

export async function getSellerPaymentsTransactions(
    filters: SellerPaymentsFilterRequest,
): Promise<SellerPaymentsTransactionsResponse> {
    const query = toQueryString(filters);
    const response = await requestApi<SellerPaymentsTransactionsResponse>(
        query.length > 0
            ? `/seller/payments/transactions?${query}`
            : "/seller/payments/transactions",
    );

    return requireData(response);
}

export async function getSellerAnalytics(
    filters: SellerAnalyticsFilterRequest,
): Promise<SellerAnalyticsResponse> {
    const params = new URLSearchParams();

    if (filters.timeRange) {
        params.set("timeRange", filters.timeRange);
    }

    const query = params.toString();
    const response = await requestApi<SellerAnalyticsResponse>(
        query.length > 0 ? `/seller/payments/analytics?${query}` : "/seller/payments/analytics",
    );

    return requireData(response);
}
