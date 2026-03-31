import type { PaginatedResponse, UUID } from "./common.js";

export type ShopStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface PublicShopItem {
    id: UUID;
    shopName: string;
    slug: string;
    description?: string | null;
}

export interface ShopDetail {
    id: UUID;
    userId: UUID;
    shopName: string;
    slug: string;
    description?: string | null;
    businessLicense?: string | null;
    status: ShopStatus;
    rejectionReason?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface AdminShopItem extends ShopDetail {
    ownerEmail: string;
    ownerFullName: string;
}

export interface PublicShopsFilterRequest {
    page?: number;
    limit?: number;
    search?: string;
}

export type PublicShopsListResponse = PaginatedResponse<PublicShopItem>;

export interface SellerUpdateShopRequest {
    shopName?: string;
    description?: string;
    businessLicense?: string;
}

export interface AdminShopsFilterRequest {
    page?: number;
    limit?: number;
    search?: string;
    status?: ShopStatus;
}

export type AdminShopsListResponse = PaginatedResponse<AdminShopItem>;

export interface AdminUpdateShopStatusRequest {
    status: ShopStatus;
    rejectionReason?: string;
}
