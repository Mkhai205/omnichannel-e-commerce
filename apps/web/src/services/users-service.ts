import type {
    ApiResponse,
    CreateAddressRequest,
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
