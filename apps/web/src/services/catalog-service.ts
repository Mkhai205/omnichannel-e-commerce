import type { ProductItem, PublicProductSuggestionsResponse } from "@repo/shared-types";
import { requestApi } from "@/services/http-client";

const DEFAULT_TODAY_SUGGESTIONS_LIMIT = 8;

export type TodaySuggestionProductsChunk = {
    items: ProductItem[];
    nextCursor: string | null;
    hasMore: boolean;
};

export type TodaySuggestionProductsChunkOptions = {
    sessionKey: string;
    limit?: number;
    cursor?: string | null;
    search?: string;
    categoryId?: string;
    shopId?: string;
};

function normalizeLimit(limit: number): number {
    if (!Number.isFinite(limit) || limit < 1) {
        return DEFAULT_TODAY_SUGGESTIONS_LIMIT;
    }

    return Math.min(Math.floor(limit), 100);
}

export async function getTodaySuggestionProducts(
    sessionKey: string,
    limit = DEFAULT_TODAY_SUGGESTIONS_LIMIT,
): Promise<ProductItem[]> {
    const chunk = await getTodaySuggestionProductsChunk({
        sessionKey,
        limit,
    });

    return chunk.items;
}

export async function getTodaySuggestionProductsChunk(
    options: TodaySuggestionProductsChunkOptions,
): Promise<TodaySuggestionProductsChunk> {
    const params = new URLSearchParams();
    params.set("sessionKey", options.sessionKey.trim());
    params.set("limit", String(normalizeLimit(options.limit ?? DEFAULT_TODAY_SUGGESTIONS_LIMIT)));

    if (options.cursor) {
        params.set("cursor", options.cursor);
    }

    if (options.search?.trim()) {
        params.set("search", options.search.trim());
    }

    if (options.categoryId) {
        params.set("categoryId", options.categoryId);
    }

    if (options.shopId) {
        params.set("shopId", options.shopId);
    }

    const response = await requestApi<PublicProductSuggestionsResponse>(
        `/catalog/products/suggestions?${params.toString()}`,
    );

    const data = response.data;

    return {
        items: data?.items ?? [],
        nextCursor: data?.nextCursor ?? null,
        hasMore: data?.hasMore ?? false,
    };
}
