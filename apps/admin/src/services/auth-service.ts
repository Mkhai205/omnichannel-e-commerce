import type {
    AuthUser,
    LoginRequest,
    LoginResponse,
    LogoutRequest,
    RefreshTokenResponse,
} from "@repo/shared-types";
import { ApiRequestError, getApiBaseUrl, requestApi } from "@/services/http-client";

function requireData<T>(response: { data?: T; message: string; statusCode: number }): T {
    if (!response.data) {
        throw new Error(`Missing response data: ${response.message} (${response.statusCode})`);
    }

    return response.data;
}

function ensureAdminUser(user: AuthUser): AuthUser {
    if (user.role !== "ADMIN") {
        throw new ApiRequestError("Only ADMIN account can access this application", 403, user);
    }

    return user;
}

export function buildAdminGoogleLoginUrl(): string {
    const query = new URLSearchParams({ source: "admin" });
    return `${getApiBaseUrl()}/auth/google/login?${query.toString()}`;
}

export async function loginAdmin(payload: LoginRequest): Promise<LoginResponse> {
    const response = await requestApi<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    const data = requireData(response);
    ensureAdminUser(data.user);
    return data;
}

export async function refreshSession(refreshToken?: string): Promise<RefreshTokenResponse> {
    const response = await requestApi<RefreshTokenResponse>("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
    });

    const data = requireData(response);
    ensureAdminUser(data.user);
    return data;
}

export async function logoutAdmin(payload?: LogoutRequest): Promise<void> {
    await requestApi<{ success: boolean }>("/auth/logout", {
        method: "POST",
        body: JSON.stringify(payload ?? {}),
    });
}

export async function getMyProfile(): Promise<AuthUser> {
    const response = await requestApi<AuthUser>("/users/me");
    const data = requireData(response);
    return ensureAdminUser(data);
}
