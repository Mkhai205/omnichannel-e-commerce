import type { ApiResponse } from "@repo/shared-types";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const API_BASE_PATH = process.env.NEXT_PUBLIC_API_BASE_PATH ?? "/api/v1";

let refreshRequestPromise: Promise<boolean> | null = null;

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

function shouldAttemptRefresh(path: string): boolean {
    return ![
        "/auth/login",
        "/auth/register",
        "/auth/forgot-password",
        "/auth/reset-password",
        "/auth/verify-email",
        "/auth/refresh",
    ].includes(path);
}

async function refreshAccessToken(): Promise<boolean> {
    if (refreshRequestPromise) {
        return refreshRequestPromise;
    }

    refreshRequestPromise = (async () => {
        try {
            const response = await fetch(buildApiUrl("/auth/refresh"), {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });

            return response.ok;
        } catch {
            return false;
        }
    })();

    try {
        return await refreshRequestPromise;
    } finally {
        refreshRequestPromise = null;
    }
}

async function parseApiResponse<T>(response: Response): Promise<ApiResponse<T> | null> {
    const text = await response.text();

    if (text.length === 0) {
        return null;
    }

    try {
        return JSON.parse(text) as ApiResponse<T>;
    } catch {
        throw new ApiRequestError("Received malformed API response", response.status, text);
    }
}

export function isApiRequestError(error: unknown): error is ApiRequestError {
    return error instanceof ApiRequestError;
}

export async function requestApi<T>(
    path: string,
    init?: RequestInit,
    hasRetried = false,
): Promise<ApiResponse<T>> {
    const response = await fetch(buildApiUrl(path), {
        ...init,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {}),
        },
    });

    const payload = await parseApiResponse<T>(response);

    if (!response.ok) {
        if (response.status === 401 && !hasRetried && shouldAttemptRefresh(path)) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                return requestApi<T>(path, init, true);
            }
        }

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
