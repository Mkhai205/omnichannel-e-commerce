import type { UUID } from "./common.js";

export type UserRole = "CUSTOMER" | "SELLER" | "ADMIN";

export interface AuthUser {
    id: UUID;
    email: string;
    fullName: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresInSeconds: number;
    user: AuthUser;
}
