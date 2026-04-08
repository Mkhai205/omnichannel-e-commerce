import type {
    AuthUser,
    LoginRequest,
    LoginResponse,
    LogoutRequest,
    RegisterRequest,
    RegisterResponse,
} from "@repo/shared-types";
import { requestApi } from "@/services/http-client";

function requireData<T>(response: { data?: T; message: string; statusCode: number }): T {
    if (!response.data) {
        throw new Error(`Missing response data: ${response.message} (${response.statusCode})`);
    }

    return response.data;
}

export async function loginCustomer(payload: LoginRequest): Promise<LoginResponse> {
    const response = await requestApi<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return requireData(response);
}

export async function registerCustomer(
    payload: Omit<RegisterRequest, "role">,
): Promise<RegisterResponse> {
    const response = await requestApi<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ ...payload, role: "CUSTOMER" }),
    });

    return requireData(response);
}

export async function logoutCustomer(payload?: LogoutRequest): Promise<void> {
    await requestApi<{ success: boolean }>("/auth/logout", {
        method: "POST",
        body: JSON.stringify(payload ?? {}),
    });
}

export async function getMyProfile(): Promise<AuthUser> {
    const response = await requestApi<AuthUser>("/users/me");
    return requireData(response);
}
