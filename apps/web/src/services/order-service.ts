import type {
    ApiResponse,
    CheckoutOrdersRequest,
    CheckoutOrdersResponse,
    CustomerOrderDetailResponse,
    CustomerOrderListResponse,
    CustomerOrdersFilterRequest,
} from "@repo/shared-types";
import { requestApi } from "@/services/http-client";

function requireData<T>(response: ApiResponse<T>): T {
    if (!response.data) {
        throw new Error(`Missing response data: ${response.message} (${response.statusCode})`);
    }

    return response.data;
}

export async function checkoutOrders(
    payload: CheckoutOrdersRequest,
): Promise<CheckoutOrdersResponse> {
    const response = await requestApi<CheckoutOrdersResponse>("/orders/checkout", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return requireData(response);
}

function buildCustomerOrdersQuery(filters: CustomerOrdersFilterRequest): string {
    const searchParams = new URLSearchParams();

    if (filters.page) {
        searchParams.set("page", String(filters.page));
    }

    if (filters.limit) {
        searchParams.set("limit", String(filters.limit));
    }

    if (filters.status) {
        searchParams.set("status", filters.status);
    }

    if (filters.search?.trim()) {
        searchParams.set("search", filters.search.trim());
    }

    const queryString = searchParams.toString();
    return queryString.length > 0 ? `?${queryString}` : "";
}

export async function getCustomerOrders(
    filters: CustomerOrdersFilterRequest,
): Promise<CustomerOrderListResponse> {
    const queryString = buildCustomerOrdersQuery(filters);
    const response = await requestApi<CustomerOrderListResponse>(`/orders${queryString}`);

    return requireData(response);
}

export async function getCustomerOrderDetail(
    orderId: string,
): Promise<CustomerOrderDetailResponse> {
    const response = await requestApi<CustomerOrderDetailResponse>(`/orders/${orderId}`);

    return requireData(response);
}
