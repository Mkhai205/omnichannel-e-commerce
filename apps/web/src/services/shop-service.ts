import type { PublicShopDetailItem } from "@repo/shared-types";
import { ApiRequestError, requestApi } from "@/services/http-client";

export async function getPublicShopById(shopId: string): Promise<PublicShopDetailItem> {
    const normalizedShopId = shopId.trim();

    const response = await requestApi<PublicShopDetailItem>(
        `/shops/by-id/${encodeURIComponent(normalizedShopId)}`,
    );

    if (!response.data) {
        throw new ApiRequestError("Empty shop payload", 500, response);
    }

    return response.data;
}

export async function getPublicShopBySlug(slug: string): Promise<PublicShopDetailItem> {
    const normalizedSlug = slug.trim();

    const response = await requestApi<PublicShopDetailItem>(
        `/shops/${encodeURIComponent(normalizedSlug)}`,
    );

    if (!response.data) {
        throw new ApiRequestError("Empty shop payload", 500, response);
    }

    return response.data;
}
