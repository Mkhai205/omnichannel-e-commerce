import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { GoogleProfilePayload, UserRole } from '@repo/shared-types';
import { randomUUID } from 'crypto';
import {
  AUTH_COOKIE_CONFIG_KEY,
  FRONTEND_REDIRECT_URI_CONFIG_KEY,
} from '../../core/config/env.constant';
import {
  GOOGLE_LOGIN_SOURCES,
  type GoogleLoginSource,
} from './dto/google-login-query.dto';

interface GoogleTokenResponse {
  access_token?: string;
}

@Injectable()
export class AuthGoogleService {
  constructor(private readonly configService: ConfigService) {}

  generateOAuthState(): string {
    return randomUUID();
  }

  getOAuthStateCookieName(): string {
    return this.configService.get<string>(
      'AUTH_COOKIE_OAUTH_STATE_NAME',
      AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_OAUTH_STATE_NAME,
    );
  }

  getOAuthSourceCookieName(): string {
    return this.configService.get<string>(
      'AUTH_COOKIE_OAUTH_SOURCE_NAME',
      AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_OAUTH_SOURCE_NAME,
    );
  }

  getLoginSuccessRedirect(): string {
    return this.configService.get<string>(
      'FRONTEND_LOGIN_SUCCESS_REDIRECT',
      FRONTEND_REDIRECT_URI_CONFIG_KEY.FRONTEND_LOGIN_SUCCESS_REDIRECT,
    );
  }

  getLoginFailureRedirect(): string {
    return this.configService.get<string>(
      'FRONTEND_LOGIN_FAILURE_REDIRECT',
      FRONTEND_REDIRECT_URI_CONFIG_KEY.FRONTEND_LOGIN_FAILURE_REDIRECT,
    );
  }

  getSellerLoginSuccessRedirect(): string {
    return this.configService.get<string>(
      'FRONTEND_SELLER_LOGIN_SUCCESS_REDIRECT',
      FRONTEND_REDIRECT_URI_CONFIG_KEY.FRONTEND_SELLER_LOGIN_SUCCESS_REDIRECT,
    );
  }

  getSellerLoginFailureRedirect(): string {
    return this.configService.get<string>(
      'FRONTEND_SELLER_LOGIN_FAILURE_REDIRECT',
      FRONTEND_REDIRECT_URI_CONFIG_KEY.FRONTEND_SELLER_LOGIN_FAILURE_REDIRECT,
    );
  }

  getLoginSuccessRedirectByRole(role: UserRole): string {
    return role === 'SELLER'
      ? this.getSellerLoginSuccessRedirect()
      : this.getLoginSuccessRedirect();
  }

  getLoginFailureRedirectBySource(source: GoogleLoginSource): string {
    return source === GOOGLE_LOGIN_SOURCES.SELLER
      ? this.getSellerLoginFailureRedirect()
      : this.getLoginFailureRedirect();
  }

  resolveLoginSource(query: {
    source?: string;
    app?: string;
    role?: string;
  }): GoogleLoginSource {
    if (query.source === GOOGLE_LOGIN_SOURCES.SELLER) {
      return GOOGLE_LOGIN_SOURCES.SELLER;
    }

    if (query.app?.trim().toLowerCase() === 'seller') {
      return GOOGLE_LOGIN_SOURCES.SELLER;
    }

    if (query.role?.trim().toUpperCase() === 'SELLER') {
      return GOOGLE_LOGIN_SOURCES.SELLER;
    }

    return GOOGLE_LOGIN_SOURCES.USER;
  }

  resolveLoginSourceFromCookie(source?: string): GoogleLoginSource {
    return source === GOOGLE_LOGIN_SOURCES.SELLER
      ? GOOGLE_LOGIN_SOURCES.SELLER
      : GOOGLE_LOGIN_SOURCES.USER;
  }

  createGoogleAuthorizeUrl(state: string): string {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const callbackUrl = this.configService.get<string>('GOOGLE_CALLBACK_URL');

    if (!clientId || !callbackUrl) {
      throw new BadRequestException('Google OAuth is not configured');
    }

    const query = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callbackUrl,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      access_type: 'offline',
      prompt: 'consent',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${query.toString()}`;
  }

  async fetchGoogleUserInfo(code: string): Promise<GoogleProfilePayload> {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('GOOGLE_CALLBACK_URL');

    if (!clientId || !clientSecret || !redirectUri) {
      throw new BadRequestException('Google OAuth is not configured');
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new UnauthorizedException(
        'Unable to exchange Google authorization code',
      );
    }

    const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;
    if (!tokenData.access_token) {
      throw new UnauthorizedException('Google access token is missing');
    }

    const userResponse = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      },
    );

    if (!userResponse.ok) {
      throw new UnauthorizedException('Unable to fetch Google profile');
    }

    const profile = (await userResponse.json()) as GoogleProfilePayload;

    if (!profile.sub || !profile.email || !profile.name) {
      throw new UnauthorizedException('Google profile is invalid');
    }

    return profile;
  }
}
