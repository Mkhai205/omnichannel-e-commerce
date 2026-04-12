import type {
    AddToCartRequest,
    ApiResponse,
    CartSummary,
    UpdateCartItemRequest,
} from "@repo/shared-types";
import { requestApi } from "@/services/http-client";

function requireData<T>(response: ApiResponse<T>): T {
    if (!response.data) {
        throw new Error(`Missing response data: ${response.message} (${response.statusCode})`);
    }

    return response.data;
}

export async function getMyCart(): Promise<CartSummary> {
    const response = await requestApi<CartSummary>("/cart");
    return requireData(response);
}

export async function addToCart(payload: AddToCartRequest): Promise<CartSummary> {
    const response = await requestApi<CartSummary>("/cart/items", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return requireData(response);
}

export async function updateCartItem(
    itemId: string,
    payload: UpdateCartItemRequest,
): Promise<CartSummary> {
    const response = await requestApi<CartSummary>(`/cart/items/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    return requireData(response);
}

export async function removeCartItem(itemId: string): Promise<CartSummary> {
    const response = await requestApi<CartSummary>(`/cart/items/${itemId}`, {
        method: "DELETE",
    });

    return requireData(response);
}

export async function clearCart(): Promise<void> {
    await requestApi<{ success: boolean }>("/cart/items", {
        method: "DELETE",
    });
}
