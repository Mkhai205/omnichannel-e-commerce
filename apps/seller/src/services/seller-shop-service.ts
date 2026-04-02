import type {
    SellerCreateShopOnboardingRequest,
    SellerUpdateShopRequest,
    ShopDetail,
    UploadShopAvatarResult,
    UploadShopCoverResult,
} from "@repo/shared-types";
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

export async function updateMySellerShop(payload: SellerUpdateShopRequest): Promise<ShopDetail> {
    const response = await requestApi<ShopDetail>("/seller/shops/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    return requireData(response);
}

export async function uploadMySellerShopAvatar(file: File): Promise<UploadShopAvatarResult> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await requestApi<UploadShopAvatarResult>("/seller/shops/avatar/upload", {
        method: "POST",
        body: formData,
    });

    return requireData(response);
}

export async function uploadMySellerShopCover(file: File): Promise<UploadShopCoverResult> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await requestApi<UploadShopCoverResult>("/seller/shops/cover/upload", {
        method: "POST",
        body: formData,
    });

    return requireData(response);
}
