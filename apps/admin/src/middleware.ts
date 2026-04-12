import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { DASHBOARD_ROUTE, isAuthPublicRoute, isLoginRoute, LOGIN_ROUTE } from "@/lib/auth-routes";

const ACCESS_COOKIE_NAME =
    process.env.NEXT_PUBLIC_AUTH_ACCESS_COOKIE_NAME ?? "ecommerce_access_token";
const REFRESH_COOKIE_NAME =
    process.env.NEXT_PUBLIC_AUTH_REFRESH_COOKIE_NAME ?? "ecommerce_refresh_token";

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    const isAuthRoute = isAuthPublicRoute(pathname);
    const hasAccessCookie = Boolean(request.cookies.get(ACCESS_COOKIE_NAME));
    const hasRefreshCookie = Boolean(request.cookies.get(REFRESH_COOKIE_NAME));
    const hasSessionCookie = hasAccessCookie || hasRefreshCookie;

    if (!hasSessionCookie && !isAuthRoute) {
        const loginUrl = new URL(LOGIN_ROUTE, request.url);
        loginUrl.searchParams.set("next", `${pathname}${search}`);
        return NextResponse.redirect(loginUrl);
    }

    if (hasSessionCookie && isLoginRoute(pathname)) {
        const dashboardUrl = new URL(DASHBOARD_ROUTE, request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
