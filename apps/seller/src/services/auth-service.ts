import type {
    AuthUser,
    LoginRequest,
    LoginResponse,
    LogoutRequest,
    RefreshTokenResponse,
    RegisterRequest,
    RegisterResponse,
} from "@repo/shared-types";
import { getApiBaseUrl, requestApi } from "@/services/http-client";

function requireData<T>(response: { data?: T; message: string; statusCode: number }): T {
    if (!response.data) {
        throw new Error(`Missing response data: ${response.message} (${response.statusCode})`);
    }

    return response.data;
}

export function buildSellerGoogleLoginUrl(): string {
    const query = new URLSearchParams({ source: "seller" });
    return `${getApiBaseUrl()}/auth/google/login?${query.toString()}`;
}

export async function loginSeller(payload: LoginRequest): Promise<LoginResponse> {
    const response = await requestApi<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return requireData(response);
}

export async function registerSeller(
    payload: Omit<RegisterRequest, "role">,
): Promise<RegisterResponse> {
    const response = await requestApi<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ ...payload, role: "SELLER" }),
    });

    return requireData(response);
}

export async function refreshSession(refreshToken?: string): Promise<RefreshTokenResponse> {
    const response = await requestApi<RefreshTokenResponse>("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
    });

    return requireData(response);
}

export async function logoutSeller(payload?: LogoutRequest): Promise<void> {
    await requestApi<{ success: boolean }>("/auth/logout", {
        method: "POST",
        body: JSON.stringify(payload ?? {}),
    });
}

export async function forgotPassword(email: string): Promise<void> {
    await requestApi<{ success: boolean }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
    });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
    await requestApi<{ success: boolean }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
    });
}

export async function verifyEmail(token: string): Promise<void> {
    await requestApi<{ success: boolean }>("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ token }),
    });
}

export async function getMyProfile(): Promise<AuthUser> {
    const response = await requestApi<AuthUser>("/users/me");
    return requireData(response);
}
