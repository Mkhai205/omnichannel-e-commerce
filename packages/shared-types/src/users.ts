import type { UserRole, UserStatus } from "./auth.js";
import type { PaginatedResponse, UUID } from "./common.js";

export type AddressType = "HOME" | "WORK" | "OTHER";

export interface UpdateProfileRequest {
    fullName?: string;
    phone?: string;
}

export interface UserAddress {
    id: UUID;
    userId: UUID;
    type: AddressType;
    recipientName: string;
    recipientPhone: string;
    streetAddress: string;
    wardDistrict?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserAddressListResponse {
    addresses: UserAddress[];
}

export interface CreateAddressRequest {
    type: AddressType;
    recipientName: string;
    recipientPhone: string;
    streetAddress: string;
    wardDistrict?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
}

export interface AdminUsersFilterRequest {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
    status?: UserStatus;
}

export interface AdminUserListItem {
    id: UUID;
    email: string;
    fullName: string;
    phone?: string | null;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
}

export type AdminUserListResponse = PaginatedResponse<AdminUserListItem>;

export interface UpdateUserStatusRequest {
    status: UserStatus;
}

export interface UpdateUserRoleRequest {
    role: UserRole;
}
