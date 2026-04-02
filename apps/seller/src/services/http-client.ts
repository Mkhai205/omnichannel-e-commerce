import type { ApiResponse } from "@repo/shared-types";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const API_BASE_PATH = process.env.NEXT_PUBLIC_API_BASE_PATH ?? "/api/v1";

export class ApiRequestError extends Error {
    statusCode: number;
    payload?: unknown;

    constructor(message: string, statusCode: number, payload?: unknown) {
        super(message);
        this.name = "ApiRequestError";
        this.statusCode = statusCode;
        this.payload = payload;
    }
}

export function getApiBaseUrl(): string {
    return `${API_URL}${API_BASE_PATH}`;
}

function buildApiUrl(path: string): string {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${getApiBaseUrl()}${normalizedPath}`;
}

export function isApiRequestError(error: unknown): error is ApiRequestError {
    return error instanceof ApiRequestError;
}

export async function requestApi<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
    const response = await fetch(buildApiUrl(path), {
        ...init,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {}),
        },
    });

    const text = await response.text();
    let payload: ApiResponse<T> | null = null;

    if (text.length > 0) {
        try {
            payload = JSON.parse(text) as ApiResponse<T>;
        } catch {
            throw new ApiRequestError("Received malformed API response", response.status, text);
        }
    }

    if (!response.ok) {
        const message =
            payload && typeof payload === "object" && "message" in payload
                ? String(payload.message)
                : `Request failed with status ${response.status}`;

        throw new ApiRequestError(message, response.status, payload);
    }

    if (!payload) {
        throw new ApiRequestError("Empty API response payload", response.status);
    }

    return payload;
}
