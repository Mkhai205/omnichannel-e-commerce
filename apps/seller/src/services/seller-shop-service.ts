import type { SellerCreateShopOnboardingRequest, ShopDetail } from "@repo/shared-types";
import { ApiRequestError, isApiRequestError, requestApi } from "@/services/http-client";

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

export async function getMySellerShop(): Promise<ShopDetail | null> {
    try {
        const response = await requestApi<ShopDetail>("/seller/shops/me");
        return requireData(response);
    } catch (error) {
        if (isApiRequestError(error) && error.statusCode === 404) {
            return null;
        }

        throw error;
    }
}

export async function createOnboardingShop(
    payload: SellerCreateShopOnboardingRequest,
): Promise<ShopDetail> {
    const response = await requestApi<ShopDetail>("/seller/shops/onboarding", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return requireData(response);
}
