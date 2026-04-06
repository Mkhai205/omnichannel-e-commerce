import type {
    CategoriesListResponse,
    CategoryItem,
    CreateProductRequest,
    CreateProductVariantRequest,
    ProductItem,
    ProductStatus,
    ProductVariantItem,
    SellerProductsFilterRequest,
    SellerProductsListResponse,
    UpdateProductRequest,
    UpdateProductVariantRequest,
    UploadCatalogImageResult,
} from "@repo/shared-types";
import { ApiRequestError, requestApi } from "@/services/http-client";

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

function toSellerProductsQueryString(filters: SellerProductsFilterRequest): string {
    const params = new URLSearchParams();

    if (typeof filters.page === "number") {
        params.set("page", String(filters.page));
    }

    if (typeof filters.limit === "number") {
        params.set("limit", String(filters.limit));
    }

    if (filters.search) {
        params.set("search", filters.search);
    }

    if (filters.categoryId) {
        params.set("categoryId", filters.categoryId);
    }

    if (filters.status) {
        params.set("status", filters.status);
    }

    return params.toString();
}

function toCategoriesQueryString(filters: {
    page?: number;
    limit?: number;
    parentId?: string;
    search?: string;
}): string {
    const params = new URLSearchParams();

    if (typeof filters.page === "number") {
        params.set("page", String(filters.page));
    }

    if (typeof filters.limit === "number") {
        params.set("limit", String(filters.limit));
    }

    if (filters.parentId) {
        params.set("parentId", filters.parentId);
    }

    if (filters.search) {
        params.set("search", filters.search);
    }

    return params.toString();
}

export async function getSellerProducts(
    filters: SellerProductsFilterRequest,
): Promise<SellerProductsListResponse> {
    const query = toSellerProductsQueryString(filters);
    const response = await requestApi<SellerProductsListResponse>(
        query.length > 0 ? `/seller/catalog/products?${query}` : "/seller/catalog/products",
    );

    return requireData(response);
}

export async function getSellerProductById(productId: string): Promise<ProductItem> {
    const response = await requestApi<ProductItem>(`/seller/catalog/products/${productId}`);
    return requireData(response);
}

export async function getSellerProductsCountByStatus(status: ProductStatus): Promise<number> {
    const response = await getSellerProducts({ page: 1, limit: 1, status });
    return response.meta.totalItems;
}

export async function getCatalogCategories(filters: {
    page?: number;
    limit?: number;
    parentId?: string;
    search?: string;
}): Promise<CategoriesListResponse> {
    const query = toCategoriesQueryString(filters);
    const response = await requestApi<CategoriesListResponse>(
        query.length > 0 ? `/catalog/categories?${query}` : "/catalog/categories",
    );

    return requireData(response);
}

export async function getCatalogCategoryMap(): Promise<Record<string, string>> {
    const categoryMap: Record<string, string> = {};
    let page = 1;
    const limit = 100;

    // Load category pages until the API reports no more pages.
    while (true) {
        const response = await getCatalogCategories({ page, limit });

        response.data.forEach((category: CategoryItem) => {
            categoryMap[category.id] = category.name;
        });

        if (page >= response.meta.totalPages || response.meta.totalPages === 0) {
            break;
        }

        page += 1;
    }

    return categoryMap;
}

export async function createSellerProduct(payload: CreateProductRequest): Promise<ProductItem> {
    const response = await requestApi<ProductItem>("/seller/catalog/products", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return requireData(response);
}

export async function updateSellerProduct(
    productId: string,
    payload: UpdateProductRequest,
): Promise<ProductItem> {
    const response = await requestApi<ProductItem>(`/seller/catalog/products/${productId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    return requireData(response);
}

export async function hideSellerProduct(productId: string): Promise<ProductItem> {
    return updateSellerProduct(productId, { status: "HIDDEN" });
}

export async function deleteSellerProduct(productId: string): Promise<{ success: boolean }> {
    const response = await requestApi<{ success: boolean }>(
        `/seller/catalog/products/${productId}`,
        {
            method: "DELETE",
        },
    );

    return requireData(response);
}

export async function createSellerProductVariant(
    productId: string,
    payload: CreateProductVariantRequest,
): Promise<ProductVariantItem> {
    const response = await requestApi<ProductVariantItem>(
        `/seller/catalog/products/${productId}/variants`,
        {
            method: "POST",
            body: JSON.stringify(payload),
        },
    );

    return requireData(response);
}

export async function updateSellerProductVariant(
    variantId: string,
    payload: UpdateProductVariantRequest,
): Promise<ProductVariantItem> {
    const response = await requestApi<ProductVariantItem>(`/seller/catalog/variants/${variantId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    return requireData(response);
}

export async function deleteSellerProductVariant(variantId: string): Promise<{ success: boolean }> {
    const response = await requestApi<{ success: boolean }>(
        `/seller/catalog/variants/${variantId}`,
        {
            method: "DELETE",
        },
    );

    return requireData(response);
}

export async function uploadCatalogImage(
    entityType: "CATEGORY" | "PRODUCT" | "PRODUCT_VARIANT",
    entityId: string,
    file: File,
): Promise<UploadCatalogImageResult> {
    const formData = new FormData();
    formData.append("entityType", entityType);
    formData.append("entityId", entityId);
    formData.append("file", file);

    const response = await requestApi<UploadCatalogImageResult>("/seller/catalog/images/upload", {
        method: "POST",
        body: formData,
    });

    return requireData(response);
}
