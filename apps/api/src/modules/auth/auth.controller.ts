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
import {
  ApiBody,
  ApiFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type {
  ApiResponse,
  LoginResponse,
  RefreshTokenResponse,
  RegisterResponse,
} from '@repo/shared-types';
import type { Request, Response } from 'express';
import { Public } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import {
  ApiAuthSchemes,
  ApiCommonErrorResponses,
  ApiCreatedEnvelopeResponse,
  ApiOkEnvelopeResponse,
} from '../../core/http/swagger-response.decorator';
import { AuthGoogleService } from './auth-google.service';
import { AuthService } from './auth.service';
import { AuthTokenService } from './auth-token.service';
import { GoogleCallbackDto } from './dto/google-callback.dto';
import {
  GOOGLE_LOGIN_SOURCES,
  GoogleLoginQueryDto,
} from './dto/google-login-query.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import {
  AuthSessionDataSwaggerDto,
  LogoutDataSwaggerDto,
} from './dto/auth-swagger.dto';
import {
  applyAuthCookies,
  clearAuthCookies,
  clearOAuthSourceCookie,
  clearOAuthStateCookie,
  resolveRefreshToken,
  setOAuthSourceCookie,
  setOAuthStateCookie,
} from './utils/auth-cookie.util';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authTokenService: AuthTokenService,
    private readonly authGoogleService: AuthGoogleService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new account' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedEnvelopeResponse(
    AuthSessionDataSwaggerDto,
    'User registered successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid payload or validation failure',
    unauthorized: false,
    notFound: false,
  })
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
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiOkEnvelopeResponse(AuthSessionDataSwaggerDto, 'Logged in successfully')
  @ApiCommonErrorResponses({
    badRequest: 'Invalid payload or validation failure',
    unauthorized: 'Invalid credentials',
    notFound: false,
  })
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
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send forgot password email' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiOkEnvelopeResponse(
    LogoutDataSwaggerDto,
    'If the email exists, a reset link has been sent',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid payload or validation failure',
    unauthorized: false,
    notFound: false,
  })
  async forgotPassword(
    @Body() payload: ForgotPasswordDto,
  ): Promise<ApiResponse<{ success: boolean }>> {
    await this.authService.forgotPassword(payload.email);

    return createSuccessResponse(
      { success: true },
      {
        statusCode: HttpStatus.OK,
        message: 'If the email exists, a reset link has been sent',
      },
    );
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiOkEnvelopeResponse(LogoutDataSwaggerDto, 'Password reset successfully')
  @ApiCommonErrorResponses({
    badRequest: 'Invalid payload or validation failure',
    unauthorized: 'Reset token invalid or expired',
    notFound: false,
  })
  async resetPassword(
    @Body() payload: ResetPasswordDto,
  ): Promise<ApiResponse<{ success: boolean }>> {
    await this.authService.resetPassword(payload.token, payload.newPassword);

    return createSuccessResponse(
      { success: true },
      {
        statusCode: HttpStatus.OK,
        message: 'Password reset successfully',
      },
    );
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email with token' })
  @ApiBody({ type: VerifyEmailDto })
  @ApiOkEnvelopeResponse(LogoutDataSwaggerDto, 'Email verified successfully')
  @ApiCommonErrorResponses({
    badRequest: 'Invalid payload or validation failure',
    unauthorized: 'Email verification token invalid or expired',
    notFound: false,
  })
  async verifyEmail(
    @Body() payload: VerifyEmailDto,
  ): Promise<ApiResponse<{ success: boolean }>> {
    await this.authService.verifyEmail(payload.token);

    return createSuccessResponse(
      { success: true },
      {
        statusCode: HttpStatus.OK,
        message: 'Email verified successfully',
      },
    );
  }

  @Public()
  @Get('google/login')
  @ApiOperation({ summary: 'Redirect user to Google OAuth consent screen' })
  @ApiQuery({
    name: 'source',
    required: false,
    enum: Object.values(GOOGLE_LOGIN_SOURCES),
  })
  @ApiQuery({ name: 'app', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, type: String })
  @ApiFoundResponse({ description: 'Redirect to Google OAuth' })
  googleLogin(
    @Query() query: GoogleLoginQueryDto,
    @Res() response: Response,
  ): void {
    const state = this.authGoogleService.generateOAuthState();
    const source = this.authGoogleService.resolveLoginSource(query);
    const stateCookieName = this.authGoogleService.getOAuthStateCookieName();
    const sourceCookieName = this.authGoogleService.getOAuthSourceCookieName();
    const redirectUrl = this.authGoogleService.createGoogleAuthorizeUrl(state);

    setOAuthStateCookie(
      response,
      stateCookieName,
      state,
      this.authTokenService.isSecureCookie(),
    );

    setOAuthSourceCookie(
      response,
      sourceCookieName,
      source,
      this.authTokenService.isSecureCookie(),
    );

    response.redirect(redirectUrl);
  }

  @Public()
  @Get('google/callback')
  @ApiOperation({
    summary: 'Handle Google OAuth callback and redirect to frontend',
  })
  @ApiQuery({ name: 'code', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  @ApiQuery({ name: 'error', required: false, type: String })
  @ApiFoundResponse({
    description: 'Redirect to frontend success or failure URL',
  })
  @ApiCommonErrorResponses({
    badRequest: 'Invalid OAuth callback query',
    unauthorized: false,
    notFound: false,
    internalServerError: false,
  })
  async googleCallback(
    @Query() query: GoogleCallbackDto,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const sourceCookieName = this.authGoogleService.getOAuthSourceCookieName();
    const source = this.authGoogleService.resolveLoginSourceFromCookie(
      request.cookies?.[sourceCookieName] as string | undefined,
    );
    const failureRedirect =
      this.authGoogleService.getLoginFailureRedirectBySource(source);
    const stateCookieName = this.authGoogleService.getOAuthStateCookieName();

    if (query.error) {
      clearOAuthStateCookie(response, stateCookieName);
      clearOAuthSourceCookie(response, sourceCookieName);
      response.redirect(
        `${failureRedirect}?message=${encodeURIComponent(query.error)}`,
      );
      return;
    }

    const expectedState = request.cookies?.[stateCookieName] as
      | string
      | undefined;

    if (!expectedState || expectedState !== query.state) {
      clearOAuthStateCookie(response, stateCookieName);
      clearOAuthSourceCookie(response, sourceCookieName);
      response.redirect(
        `${failureRedirect}?message=${encodeURIComponent('Invalid OAuth state')}`,
      );
      return;
    }

    try {
      const result = await this.authService.loginWithGoogleCode(
        query.code,
        {
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'],
        },
        source,
      );

      clearOAuthStateCookie(response, stateCookieName);
      clearOAuthSourceCookie(response, sourceCookieName);
      applyAuthCookies(
        response,
        result.accessToken,
        result.refreshToken,
        this.getTokenCookieOptions(),
      );
      response.redirect(
        this.authGoogleService.getLoginSuccessRedirectByRole(result.user.role),
      );
    } catch {
      clearOAuthStateCookie(response, stateCookieName);
      clearOAuthSourceCookie(response, sourceCookieName);
      response.redirect(
        `${failureRedirect}?message=${encodeURIComponent('Google login failed')}`,
      );
    }
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkEnvelopeResponse(
    AuthSessionDataSwaggerDto,
    'Token refreshed successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Refresh token not found in body/cookie',
    unauthorized: 'Refresh token invalid or expired',
    notFound: false,
  })
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
  @ApiOperation({ summary: 'Logout current session or all sessions' })
  @ApiAuthSchemes()
  @ApiBody({ type: LogoutDto })
  @ApiOkEnvelopeResponse(LogoutDataSwaggerDto, 'Logged out successfully')
  @ApiCommonErrorResponses({
    badRequest: 'Invalid logout payload',
    unauthorized: 'Authentication required',
    notFound: false,
  })
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
