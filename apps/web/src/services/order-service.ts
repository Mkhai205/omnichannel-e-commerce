import type {
    ApiResponse,
    CheckoutOrdersRequest,
    CheckoutOrdersResponse,
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
