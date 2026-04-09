import type { PaginatedResponse, UUID } from "./common.js";

export type ProductStatus = "DRAFT" | "ACTIVE" | "HIDDEN";

export type CatalogImageEntityType = "CATEGORY" | "PRODUCT" | "PRODUCT_VARIANT";

export type InventoryStockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export type VariantAttributes = Record<string, string>;

export interface CategoryItem {
    id: UUID;
    parentId?: UUID | null;
    name: string;
    slug: string;
    imageKey?: string | null;
    imageUrl?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ProductVariantItem {
    id: UUID;
    productId: UUID;
    sku: string;
    attributes: VariantAttributes;
    price: string;
    imageKey?: string | null;
    imageUrl?: string | null;
    stockQuantity: number;
    createdAt: string;
    updatedAt: string;
}

export interface ProductItem {
    id: UUID;
    shopId: UUID;
    categoryId: UUID;
    name: string;
    description?: string | null;
    imageKey?: string | null;
    imageUrl?: string | null;
    status: ProductStatus;
    createdAt: string;
    updatedAt: string;
    variants: ProductVariantItem[];
}

export interface PublicProductsFilterRequest {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: UUID;
    shopId?: UUID;
}

export interface PublicProductSuggestionsRequest {
    limit?: number;
    cursor?: string;
    sessionKey: string;
    search?: string;
    categoryId?: UUID;
    shopId?: UUID;
}

export interface PublicProductSuggestionsResponse {
    items: ProductItem[];
    nextCursor?: string | null;
    hasMore: boolean;
}

export interface SellerProductsFilterRequest {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: UUID;
    status?: ProductStatus;
}

export interface AdminProductsFilterRequest {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: UUID;
    shopId?: UUID;
    status?: ProductStatus;
}

export interface CreateCategoryRequest {
    parentId?: UUID;
    name: string;
    slug: string;
    imageKey?: string | null;
}

export interface CreateProductRequest {
    categoryId: UUID;
    name: string;
    description?: string;
    imageKey?: string | null;
    status?: ProductStatus;
}

export interface UpdateProductRequest {
    categoryId?: UUID;
    name?: string;
    description?: string;
    imageKey?: string | null;
    status?: ProductStatus;
}

export interface UpdateProductStatusRequest {
    status: ProductStatus;
}

export interface CreateProductVariantRequest {
    sku: string;
    attributes: VariantAttributes;
    price: string;
    imageKey?: string | null;
    stockQuantity?: number;
}

export interface UpdateProductVariantRequest {
    attributes?: VariantAttributes;
    price?: string;
    imageKey?: string | null;
    stockQuantity?: number;
}

export interface UploadCatalogImageRequest {
    entityType: CatalogImageEntityType;
    entityId: UUID;
}

export interface UploadCatalogImageResult {
    bucketName: string;
    objectKey: string;
    imageUrl?: string | null;
}

export type CategoriesListResponse = PaginatedResponse<CategoryItem>;

export type PublicProductsListResponse = PaginatedResponse<ProductItem>;

export type SellerProductsListResponse = PaginatedResponse<ProductItem>;

export type AdminProductsListResponse = PaginatedResponse<ProductItem>;
