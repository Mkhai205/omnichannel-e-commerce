import type { PaginatedResponse, UUID } from "./common.js";

export type ProductStatus = "DRAFT" | "ACTIVE" | "HIDDEN";

export type InventoryLogType = "IMPORT" | "EXPORT" | "RETURN" | "ORDER_DEDUCT";

export type VariantAttributes = Record<string, string>;

export type OmnichannelSyncStatus = Record<string, string>;

export interface CategoryItem {
    id: UUID;
    parentId?: UUID | null;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductVariantItem {
    id: UUID;
    productId: UUID;
    sku: string;
    attributes: VariantAttributes;
    price: string;
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
    omnichannelSyncStatus: OmnichannelSyncStatus;
    status: ProductStatus;
    createdAt: string;
    updatedAt: string;
    variants: ProductVariantItem[];
}

export interface InventoryLogItem {
    id: UUID;
    variantId: UUID;
    type: InventoryLogType;
    quantityChanged: number;
    note?: string | null;
    createdAt: string;
}

export interface PublicProductsFilterRequest {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: UUID;
    shopId?: UUID;
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
}

export interface CreateProductRequest {
    categoryId: UUID;
    name: string;
    description?: string;
    status?: ProductStatus;
    omnichannelSyncStatus?: OmnichannelSyncStatus;
}

export interface UpdateProductRequest {
    categoryId?: UUID;
    name?: string;
    description?: string;
    status?: ProductStatus;
    omnichannelSyncStatus?: OmnichannelSyncStatus;
}

export interface UpdateProductStatusRequest {
    status: ProductStatus;
}

export interface CreateProductVariantRequest {
    sku: string;
    attributes: VariantAttributes;
    price: string;
    stockQuantity?: number;
}

export interface UpdateProductVariantRequest {
    attributes?: VariantAttributes;
    price?: string;
    stockQuantity?: number;
}

export interface CreateInventoryLogRequest {
    type: InventoryLogType;
    quantityChanged: number;
    note?: string;
}

export type CategoriesListResponse = PaginatedResponse<CategoryItem>;

export type PublicProductsListResponse = PaginatedResponse<ProductItem>;

export type SellerProductsListResponse = PaginatedResponse<ProductItem>;

export type AdminProductsListResponse = PaginatedResponse<ProductItem>;

export type InventoryLogsListResponse = PaginatedResponse<InventoryLogItem>;
