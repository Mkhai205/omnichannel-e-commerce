import { isApiRequestError } from "@/services/http-client";

export function toFriendlyErrorMessage(error: unknown, fallbackMessage: string): string {
    if (isApiRequestError(error)) {
        return error.message || fallbackMessage;
    }

    return fallbackMessage;
}

export const TOAST_REASON_MESSAGES = {
    "auth-required": "Vui lòng đăng nhập để tiếp tục.",
    "already-authenticated": "Bạn đã đăng nhập trước đó.",
} as const;
