import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import type {
  ApiResponse,
  LoginResponse,
  RefreshTokenResponse,
  RegisterResponse,
} from '@repo/shared-types';
import type { Request, Response } from 'express';
import { Public } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import { AuthGoogleService } from './auth-google.service';
import { AuthService } from './auth.service';
import { AuthTokenService } from './auth-token.service';
import { GoogleCallbackDto } from './dto/google-callback.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import {
  applyAuthCookies,
  clearAuthCookies,
  clearOAuthStateCookie,
  resolveRefreshToken,
  setOAuthStateCookie,
} from './utils/auth-cookie.util';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authTokenService: AuthTokenService,
    private readonly authGoogleService: AuthGoogleService,
  ) {}

  @Public()
  @Post('register')
  async register(
    @Body() payload: RegisterDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ApiResponse<RegisterResponse>> {
    const result = await this.authService.register(payload, {
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    applyAuthCookies(
      response,
      result.accessToken,
      result.refreshToken,
      this.getTokenCookieOptions(),
    );

    return createSuccessResponse(result, {
      statusCode: HttpStatus.CREATED,
      message: 'Registered successfully',
    });
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() payload: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ApiResponse<LoginResponse>> {
    const result = await this.authService.login(payload, {
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    applyAuthCookies(
      response,
      result.accessToken,
      result.refreshToken,
      this.getTokenCookieOptions(),
    );

    return createSuccessResponse(result, {
      statusCode: HttpStatus.OK,
      message: 'Logged in successfully',
    });
  }

  @Public()
  @Get('google/login')
  googleLogin(@Res() response: Response): void {
    const state = this.authGoogleService.generateOAuthState();
    const stateCookieName = this.authGoogleService.getOAuthStateCookieName();
    const redirectUrl = this.authGoogleService.createGoogleAuthorizeUrl(state);

    setOAuthStateCookie(
      response,
      stateCookieName,
      state,
      this.authTokenService.isSecureCookie(),
    );

    response.redirect(redirectUrl);
  }

  @Public()
  @Get('google/callback')
  async googleCallback(
    @Query() query: GoogleCallbackDto,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const failureRedirect = this.authGoogleService.getLoginFailureRedirect();

    if (query.error) {
      response.redirect(
        `${failureRedirect}?message=${encodeURIComponent(query.error)}`,
      );
      return;
    }

    const stateCookieName = this.authGoogleService.getOAuthStateCookieName();
    const expectedState = request.cookies?.[stateCookieName] as
      | string
      | undefined;

    if (!expectedState || expectedState !== query.state) {
      clearOAuthStateCookie(response, stateCookieName);
      response.redirect(
        `${failureRedirect}?message=${encodeURIComponent('Invalid OAuth state')}`,
      );
      return;
    }

    try {
      const result = await this.authService.loginWithGoogleCode(query.code, {
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
      });

      clearOAuthStateCookie(response, stateCookieName);
      applyAuthCookies(
        response,
        result.accessToken,
        result.refreshToken,
        this.getTokenCookieOptions(),
      );
      response.redirect(this.authGoogleService.getLoginSuccessRedirect());
    } catch {
      clearOAuthStateCookie(response, stateCookieName);
      response.redirect(
        `${failureRedirect}?message=${encodeURIComponent('Google login failed')}`,
      );
    }
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Body() payload: RefreshTokenDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ApiResponse<RefreshTokenResponse>> {
    const refreshToken = resolveRefreshToken(
      payload.refreshToken,
      request,
      this.authTokenService.getRefreshTokenCookieName(),
    );

    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    const result = await this.authService.refresh(refreshToken, {
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });

    applyAuthCookies(
      response,
      result.accessToken,
      result.refreshToken,
      this.getTokenCookieOptions(),
    );

    return createSuccessResponse(result, {
      statusCode: HttpStatus.OK,
      message: 'Token refreshed successfully',
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Body() payload: LogoutDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ApiResponse<{ success: boolean }>> {
    const refreshToken = resolveRefreshToken(
      payload.refreshToken,
      request,
      this.authTokenService.getRefreshTokenCookieName(),
    );

    await this.authService.logout(refreshToken, payload.logoutAll ?? false);

    clearAuthCookies(response, this.getTokenCookieOptions());

    return createSuccessResponse({ success: true }, { message: 'Logged out' });
  }

  private getTokenCookieOptions() {
    return {
      secure: this.authTokenService.isSecureCookie(),
      accessCookieName: this.authTokenService.getAccessTokenCookieName(),
      refreshCookieName: this.authTokenService.getRefreshTokenCookieName(),
      accessMaxAgeMs: this.authTokenService.getAccessCookieMaxAgeMs(),
      refreshMaxAgeMs: this.authTokenService.getRefreshCookieMaxAgeMs(),
    };
  }
}
