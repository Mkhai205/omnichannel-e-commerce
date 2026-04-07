import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
    AUTH_CALLBACK_PREFIX,
    isAuthPublicRoute,
    isLoginOrRegisterRoute,
    LOGIN_ROUTE,
} from "@/lib/auth-routes";

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

    if (
        hasSessionCookie &&
        isLoginOrRegisterRoute(pathname) &&
        !pathname.startsWith(AUTH_CALLBACK_PREFIX)
    ) {
        const homeUrl = new URL("/", request.url);
        return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
