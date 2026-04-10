import type {
    ApiResponse,
    AuthUser,
    CreateAddressRequest,
    UpdateAddressRequest,
    UpdateProfileRequest,
    UserAddress,
    UserAddressListResponse,
} from "@repo/shared-types";
import { requestApi } from "@/services/http-client";

function requireData<T>(response: ApiResponse<T>): T {
    if (!response.data) {
        throw new Error(`Missing response data: ${response.message} (${response.statusCode})`);
    }

    return response.data;
}

export async function getMyAddresses(): Promise<UserAddressListResponse> {
    const response = await requestApi<UserAddressListResponse>("/users/me/addresses");
    return requireData(response);
}

export async function createMyAddress(payload: CreateAddressRequest): Promise<UserAddress> {
    const response = await requestApi<UserAddress>("/users/me/addresses", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return requireData(response);
}

export async function updateMyProfile(payload: UpdateProfileRequest): Promise<AuthUser> {
    const response = await requestApi<AuthUser>("/users/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    return requireData(response);
}

export async function updateMyAddress(
    addressId: string,
    payload: UpdateAddressRequest,
): Promise<UserAddress> {
    const response = await requestApi<UserAddress>(`/users/me/addresses/${addressId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    return requireData(response);
}

export async function deleteMyAddress(addressId: string): Promise<{ success: boolean }> {
    const response = await requestApi<{ success: boolean }>(`/users/me/addresses/${addressId}`, {
        method: "DELETE",
    });

    return requireData(response);
}
