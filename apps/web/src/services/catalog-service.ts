import type { PaginationMeta, ProductItem, PublicProductsListResponse } from "@repo/shared-types";
import { requestApi } from "@/services/http-client";

const DEFAULT_TODAY_SUGGESTIONS_LIMIT = 8;

export type TodaySuggestionProductsPage = {
    items: ProductItem[];
    meta: PaginationMeta | null;
};

function normalizePage(page: number): number {
    if (!Number.isFinite(page) || page < 1) {
        return 1;
    }

    return Math.floor(page);
}

function normalizeLimit(limit: number): number {
    if (!Number.isFinite(limit) || limit < 1) {
        return DEFAULT_TODAY_SUGGESTIONS_LIMIT;
    }

    return Math.min(Math.floor(limit), 100);
}

export async function getTodaySuggestionProducts(
    limit = DEFAULT_TODAY_SUGGESTIONS_LIMIT,
): Promise<ProductItem[]> {
    const pageResult = await getTodaySuggestionProductsPage(1, limit);

    return pageResult.items;
}

export async function getTodaySuggestionProductsPage(
    page = 1,
    limit = DEFAULT_TODAY_SUGGESTIONS_LIMIT,
): Promise<TodaySuggestionProductsPage> {
    const params = new URLSearchParams({
        page: String(normalizePage(page)),
        limit: String(normalizeLimit(limit)),
    });

    const response = await requestApi<PublicProductsListResponse>(
        `/catalog/products?${params.toString()}`,
    );

    const paginatedData = response.data;

    return {
        items: paginatedData?.data ?? [],
        meta: paginatedData?.meta ?? null,
    };
}
