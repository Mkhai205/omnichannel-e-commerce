export const LOGIN_ROUTE = "/login";
export const REGISTER_ROUTE = "/register";

const AUTH_PUBLIC_PREFIXES = [LOGIN_ROUTE, REGISTER_ROUTE];

const PROTECTED_ROUTE_PREFIXES = ["/account", "/cart", "/checkout", "/orders", "/wishlist"];

export function isAuthPublicRoute(pathname: string): boolean {
    return AUTH_PUBLIC_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
}

export function isLoginOrRegisterRoute(pathname: string): boolean {
    return pathname === LOGIN_ROUTE || pathname === REGISTER_ROUTE;
}

export function isProtectedRoute(pathname: string): boolean {
    return PROTECTED_ROUTE_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
}
