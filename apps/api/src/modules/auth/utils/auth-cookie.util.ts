import type { Request, Response } from 'express';
import { AUTH_COOKIE_CONFIG_KEY } from '../../../core/config/env.constant';

interface TokenCookieOptions {
  secure: boolean;
  accessCookieName: string;
  refreshCookieName: string;
  cookieDomain?: string;
  accessMaxAgeMs: number;
  refreshMaxAgeMs: number;
}

export function resolveRefreshToken(
  tokenFromBody: string | undefined,
  request: Request,
  refreshCookieName: string,
): string | undefined {
  if (tokenFromBody) {
    return tokenFromBody;
  }

  const tokenFromCookie = request.cookies?.[refreshCookieName] as
    | string
    | undefined;

  return tokenFromCookie;
}

export function applyAuthCookies(
  response: Response,
  accessToken: string,
  refreshToken: string,
  options: TokenCookieOptions,
): void {
  response.cookie(options.accessCookieName, accessToken, {
    httpOnly: true,
    sameSite: AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_SAME_SITE,
    secure: options.secure,
    domain: options.cookieDomain,
    maxAge: options.accessMaxAgeMs,
    path: '/',
  });

  response.cookie(options.refreshCookieName, refreshToken, {
    httpOnly: true,
    sameSite: AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_SAME_SITE,
    secure: options.secure,
    domain: options.cookieDomain,
    maxAge: options.refreshMaxAgeMs,
    path: '/',
  });
}

export function clearAuthCookies(
  response: Response,
  options: Pick<
    TokenCookieOptions,
    'secure' | 'accessCookieName' | 'refreshCookieName' | 'cookieDomain'
  >,
): void {
  response.clearCookie(options.accessCookieName, {
    httpOnly: true,
    sameSite: AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_SAME_SITE,
    secure: options.secure,
    domain: options.cookieDomain,
    path: '/',
  });

  response.clearCookie(options.refreshCookieName, {
    httpOnly: true,
    sameSite: AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_SAME_SITE,
    secure: options.secure,
    domain: options.cookieDomain,
    path: '/',
  });
}

export function setOAuthStateCookie(
  response: Response,
  cookieName: string,
  state: string,
  secure: boolean,
  cookieDomain?: string,
): void {
  response.cookie(cookieName, state, {
    httpOnly: true,
    sameSite: AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_SAME_SITE,
    secure,
    domain: cookieDomain,
    maxAge: AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_STATE_MAX_AGE_SECONDS * 1000,
    path: '/',
  });
}

export function clearOAuthStateCookie(
  response: Response,
  cookieName: string,
  cookieDomain?: string,
): void {
  response.clearCookie(cookieName, {
    domain: cookieDomain,
    path: '/',
  });
}

export function setOAuthSourceCookie(
  response: Response,
  cookieName: string,
  source: string,
  secure: boolean,
  cookieDomain?: string,
): void {
  response.cookie(cookieName, source, {
    httpOnly: true,
    sameSite: AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_SAME_SITE,
    secure,
    domain: cookieDomain,
    maxAge: AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_STATE_MAX_AGE_SECONDS * 1000,
    path: '/',
  });
}

export function clearOAuthSourceCookie(
  response: Response,
  cookieName: string,
  cookieDomain?: string,
): void {
  response.clearCookie(cookieName, {
    domain: cookieDomain,
    path: '/',
  });
}
