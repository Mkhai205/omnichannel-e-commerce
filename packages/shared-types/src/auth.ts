import type { UUID } from "./common.js";

export type UserRole = "CUSTOMER" | "SELLER" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED" | "UNVERIFIED";
export type RegistrationRole = "CUSTOMER" | "SELLER";

export const AUTH_PROVIDER = {
    GOOGLE: "GOOGLE",
} as const;

export type AuthProvider = (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];

export interface AuthUser {
    id: UUID;
    email: string;
    fullName: string;
    phone?: string | null;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: RegistrationRole;
}

export interface RegisterResponse {
    accessToken: string;
    refreshToken: string;
    expiresInSeconds: number;
    user: AuthUser;
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

export interface RefreshTokenRequest {
    refreshToken?: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresInSeconds: number;
    user: AuthUser;
}

export interface LogoutRequest {
    refreshToken?: string;
    logoutAll?: boolean;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresInSeconds: number;
}

export interface GoogleProfilePayload {
    sub: string;
    email: string;
    name: string;
    picture?: string;
}
