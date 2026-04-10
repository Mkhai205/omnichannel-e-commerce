import type {
    CategoriesListResponse,
    CategoryItem,
    ProductItem,
    ProductReviewsListResponse,
    PublicProductSuggestionsResponse,
    PublicProductsListResponse,
} from "@repo/shared-types";
import { ApiRequestError, requestApi } from "@/services/http-client";

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

export type CatalogCategoriesQueryOptions = {
    page?: number;
    limit?: number;
    parentId?: string;
    search?: string;
};

export type CatalogProductsQueryOptions = {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    shopId?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: number;
};

export type CatalogProductReviewsQueryOptions = {
    page?: number;
    limit?: number;
};

function normalizeLimit(limit: number): number {
    if (!Number.isFinite(limit) || limit < 1) {
        return DEFAULT_TODAY_SUGGESTIONS_LIMIT;
    }

    return Math.min(Math.floor(limit), 100);
}

function normalizePage(page?: number): number {
    if (!page || !Number.isFinite(page) || page < 1) {
        return 1;
    }

    return Math.floor(page);
}

function toTrimmedValue(value?: string): string | undefined {
    const trimmedValue = value?.trim();
    return trimmedValue ? trimmedValue : undefined;
}

function appendIfPresent(params: URLSearchParams, key: string, value?: string | number): void {
    if (typeof value === "undefined") {
        return;
    }

    const serializedValue = String(value).trim();

    if (serializedValue.length === 0) {
        return;
    }

    params.set(key, serializedValue);
}

export async function getCatalogCategoryBySlug(slug: string): Promise<CategoryItem> {
    const normalizedSlug = slug.trim();

    const response = await requestApi<CategoryItem>(
        `/catalog/categories/by-slug/${encodeURIComponent(normalizedSlug)}`,
    );

    if (!response.data) {
        throw new ApiRequestError("Empty category payload", 500, response);
    }

    return response.data;
}

export async function getCatalogCategories(
    options: CatalogCategoriesQueryOptions = {},
): Promise<CategoriesListResponse> {
    const params = new URLSearchParams();
    params.set("page", String(normalizePage(options.page)));
    params.set("limit", String(normalizeLimit(options.limit ?? 20)));

    appendIfPresent(params, "parentId", toTrimmedValue(options.parentId));
    appendIfPresent(params, "search", toTrimmedValue(options.search));

    const response = await requestApi<CategoriesListResponse>(
        `/catalog/categories?${params.toString()}`,
    );

    if (!response.data) {
        throw new ApiRequestError("Empty categories payload", 500, response);
    }

    return response.data;
}

export async function getCatalogProducts(
    options: CatalogProductsQueryOptions = {},
): Promise<PublicProductsListResponse> {
    const params = new URLSearchParams();
    params.set("page", String(normalizePage(options.page)));
    params.set("limit", String(normalizeLimit(options.limit ?? 20)));

    appendIfPresent(params, "search", toTrimmedValue(options.search));
    appendIfPresent(params, "categoryId", toTrimmedValue(options.categoryId));
    appendIfPresent(params, "shopId", toTrimmedValue(options.shopId));
    appendIfPresent(params, "minPrice", toTrimmedValue(options.minPrice));
    appendIfPresent(params, "maxPrice", toTrimmedValue(options.maxPrice));

    if (typeof options.minRating === "number" && Number.isFinite(options.minRating)) {
        appendIfPresent(params, "minRating", options.minRating);
    }

    const response = await requestApi<PublicProductsListResponse>(
        `/catalog/products?${params.toString()}`,
    );

    if (!response.data) {
        throw new ApiRequestError("Empty products payload", 500, response);
    }

    return response.data;
}

export async function getCatalogProductById(productId: string): Promise<ProductItem> {
    const normalizedProductId = productId.trim();

    const response = await requestApi<ProductItem>(
        `/catalog/products/${encodeURIComponent(normalizedProductId)}`,
    );

    if (!response.data) {
        throw new ApiRequestError("Empty product payload", 500, response);
    }

    return response.data;
}

export async function getCatalogProductReviews(
    productId: string,
    options: CatalogProductReviewsQueryOptions = {},
): Promise<ProductReviewsListResponse> {
    const normalizedProductId = productId.trim();
    const params = new URLSearchParams();
    params.set("page", String(normalizePage(options.page)));
    params.set("limit", String(normalizeLimit(options.limit ?? 10)));

    const response = await requestApi<ProductReviewsListResponse>(
        `/catalog/products/${encodeURIComponent(normalizedProductId)}/reviews?${params.toString()}`,
    );

    if (!response.data) {
        throw new ApiRequestError("Empty product reviews payload", 500, response);
    }

    return response.data;
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
