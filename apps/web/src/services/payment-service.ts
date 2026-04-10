import type {
    ApiResponse,
    PaymentStatusByOrderResponse,
    VnpayReturnResponse,
} from "@repo/shared-types";
import { requestApi } from "@/services/http-client";

function requireData<T>(response: ApiResponse<T>): T {
    if (!response.data) {
        throw new Error(`Missing response data: ${response.message} (${response.statusCode})`);
    }

    return response.data;
}

function toQueryString(input: URLSearchParams | Record<string, string>): string {
    if (input instanceof URLSearchParams) {
        return input.toString();
    }

    return new URLSearchParams(input).toString();
}

export async function verifyVnpayReturn(
    query: URLSearchParams | Record<string, string>,
): Promise<VnpayReturnResponse> {
    const queryString = toQueryString(query);
    const path = queryString ? `/payments/vnpay/return?${queryString}` : "/payments/vnpay/return";
    const response = await requestApi<VnpayReturnResponse>(path);
    return requireData(response);
}

export async function getPaymentStatusByOrder(
    orderId: string,
): Promise<PaymentStatusByOrderResponse> {
    const response = await requestApi<PaymentStatusByOrderResponse>(`/payments/${orderId}/status`);
    return requireData(response);
}
