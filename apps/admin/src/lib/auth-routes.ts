export const LOGIN_ROUTE = "/login";
export const VERIFY_EMAIL_ROUTE = "/verify-email";
export const AUTH_CALLBACK_PREFIX = "/auth/callback";
export const DASHBOARD_ROUTE = "/dashboard";

const AUTH_PUBLIC_PREFIXES = [LOGIN_ROUTE, VERIFY_EMAIL_ROUTE, AUTH_CALLBACK_PREFIX];

export function isAuthPublicRoute(pathname: string): boolean {
    return AUTH_PUBLIC_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
}

export function isLoginRoute(pathname: string): boolean {
    return pathname === LOGIN_ROUTE || pathname.startsWith(`${LOGIN_ROUTE}/`);
}
