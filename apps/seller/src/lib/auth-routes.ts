export const LOGIN_ROUTE = "/login";
export const REGISTER_ROUTE = "/register";
export const FORGOT_PASSWORD_ROUTE = "/forgot-password";
export const RESET_PASSWORD_ROUTE = "/reset-password";
export const VERIFY_EMAIL_ROUTE = "/verify-email";
export const AUTH_CALLBACK_PREFIX = "/auth/callback";
export const ONBOARDING_ROUTE = "/onboarding";

const AUTH_PUBLIC_PREFIXES = [
    LOGIN_ROUTE,
    REGISTER_ROUTE,
    FORGOT_PASSWORD_ROUTE,
    RESET_PASSWORD_ROUTE,
    VERIFY_EMAIL_ROUTE,
    AUTH_CALLBACK_PREFIX,
];

export function isAuthPublicRoute(pathname: string): boolean {
    return AUTH_PUBLIC_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
}

export function isLoginOrRegisterRoute(pathname: string): boolean {
    return (
        pathname === LOGIN_ROUTE ||
        pathname.startsWith(`${LOGIN_ROUTE}/`) ||
        pathname === REGISTER_ROUTE ||
        pathname.startsWith(`${REGISTER_ROUTE}/`)
    );
}
