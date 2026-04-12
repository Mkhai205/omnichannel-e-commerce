import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  AuthUser,
  LoginResponse,
  RefreshTokenResponse,
  RegisterResponse,
  UserStatus,
  UserRole,
  RegisterRequest,
} from '@repo/shared-types';
import bcrypt from 'bcrypt';
import { MailService } from '../../infrastructure/mail/mail.service';
import { MailTemplateService } from '../../infrastructure/mail/mail-template.service';
import { AuthGoogleService } from './auth-google.service';
import { AuthRepository } from './auth.repository';
import { AuthTokenService } from './auth-token.service';
import {
  GOOGLE_LOGIN_SOURCES,
  type GoogleLoginSource,
} from './dto/google-login-query.dto';
import { REGISTRATION_ROLES } from './dto/register.dto';
import { FRONTEND_REDIRECT_URI_CONFIG_KEY } from '../../core/config/env.constant';

interface RequestMeta {
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly authTokenService: AuthTokenService,
    private readonly authGoogleService: AuthGoogleService,
    private readonly mailService: MailService,
    private readonly mailTemplateService: MailTemplateService,
    private readonly configService: ConfigService,
  ) {}

  async register(input: RegisterRequest): Promise<RegisterResponse> {
    const role = input.role ?? REGISTRATION_ROLES.CUSTOMER;
    const normalizedEmail = input.email.toLowerCase();

    const existingUser =
      await this.authRepository.findUserByEmail(normalizedEmail);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await this.authRepository.createLocalUser({
      email: normalizedEmail,
      passwordHash,
      fullName: input.fullName,
      phone: input.phone,
      role,
      status: 'UNVERIFIED',
    });

    await this.sendVerifyEmail(user.id, user.email, user.fullName, user.role);

    return {
      success: true,
      requiresEmailVerification: true,
    };
  }

  async login(
    input: { email: string; password: string },
    meta: RequestMeta,
  ): Promise<LoginResponse> {
    const user = await this.authRepository.findUserByEmail(
      input.email.toLowerCase(),
    );

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.assertUserCanLogin(user.status);

    const tokens = await this.authTokenService.issueTokenPair(user, meta);

    return {
      ...tokens,
      user: this.toAuthUser(user),
    };
  }

  async refresh(
    refreshToken: string,
    meta: RequestMeta,
  ): Promise<RefreshTokenResponse> {
    const payload =
      await this.authTokenService.verifyRefreshToken(refreshToken);

    const user = await this.authRepository.findUserByIdWithActiveRefreshTokens(
      payload.sub,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const matchedToken = await this.findMatchingRefreshToken(
      user.refreshTokens,
      refreshToken,
    );

    if (!matchedToken || matchedToken.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.authRepository.revokeRefreshTokenById(matchedToken.id);

    const tokens = await this.authTokenService.issueTokenPair(user, meta);

    return {
      ...tokens,
      user: this.toAuthUser(user),
    };
  }

  async logout(
    refreshToken: string | undefined,
    logoutAll: boolean,
  ): Promise<void> {
    if (!refreshToken) {
      return;
    }

    const payload =
      await this.authTokenService.verifyRefreshToken(refreshToken);

    if (logoutAll) {
      await this.authRepository.revokeAllActiveRefreshTokensByUserId(
        payload.sub,
      );
      return;
    }

    const activeTokens =
      await this.authRepository.findActiveRefreshTokensByUserId(payload.sub);

    const matchedToken = await this.findMatchingRefreshToken(
      activeTokens,
      refreshToken,
    );

    if (matchedToken) {
      await this.authRepository.revokeRefreshTokenById(matchedToken.id);
    }
  }

  async loginWithGoogleCode(
    code: string,
    meta: RequestMeta,
    source: GoogleLoginSource = GOOGLE_LOGIN_SOURCES.USER,
  ): Promise<LoginResponse> {
    const googleUser = await this.authGoogleService.fetchGoogleUserInfo(code);
    const normalizedEmail = googleUser.email.toLowerCase();
    const sellerLogin = source === GOOGLE_LOGIN_SOURCES.SELLER;

    let user = await this.authRepository.findUserByGoogleProviderId(
      googleUser.sub,
    );

    if (!user) {
      user = await this.authRepository.findUserByEmail(normalizedEmail);
    }

    if (!user) {
      user = await this.authRepository.createGoogleUser({
        email: normalizedEmail,
        fullName: googleUser.name,
        providerUserId: googleUser.sub,
        picture: googleUser.picture,
        role: sellerLogin ? 'SELLER' : 'CUSTOMER',
      });
    } else {
      await this.ensureGoogleAccountLinked(user.id, googleUser);

      if (sellerLogin && user.role === 'CUSTOMER') {
        user = await this.authRepository.promoteCustomerToSeller(user.id);
      }
    }

    this.assertUserCanLogin(user.status);

    const tokens = await this.authTokenService.issueTokenPair(user, meta);

    return {
      ...tokens,
      user: this.toAuthUser(user),
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const normalizedEmail = email.toLowerCase();
    const user = await this.authRepository.findUserByEmail(normalizedEmail);

    if (!user || !user.passwordHash) {
      return;
    }

    try {
      const resetToken = await this.authTokenService.issuePasswordResetToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      const resetUrl = this.buildResetPasswordUrl(resetToken, user.role);
      const template =
        await this.mailTemplateService.buildResetPasswordEmailTemplate(
          user.fullName,
          resetUrl,
        );

      await this.mailService.sendMail({
        to: user.email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });
    } catch (error: unknown) {
      this.logger.warn(
        `Forgot password email failed for ${normalizedEmail}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const payload = await this.authTokenService.verifyPasswordResetToken(token);

    const user = await this.authRepository.findUserByIdWithActiveRefreshTokens(
      payload.sub,
    );

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid reset password token');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.authRepository.updateUserPasswordById(user.id, passwordHash);
    await this.authRepository.revokeAllActiveRefreshTokensByUserId(user.id);
  }

  async verifyEmail(token: string): Promise<void> {
    const tokenService = this.authTokenService as {
      verifyEmailVerificationToken(
        value: string,
      ): Promise<{ sub: string; email: string }>;
    };
    const payload = await tokenService.verifyEmailVerificationToken(token);

    const user = await this.authRepository.findUserByEmail(payload.email);

    if (!user || user.id !== payload.sub) {
      throw new UnauthorizedException('Invalid email verification token');
    }

    if (user.status === 'ACTIVE') {
      return;
    }

    const authRepository = this.authRepository as {
      activateUserById(userId: string): Promise<unknown>;
    };
    await authRepository.activateUserById(user.id);
    await this.sendWelcomeEmail(user.email, user.fullName);
  }

  private async ensureGoogleAccountLinked(
    userId: string,
    googleUser: {
      sub: string;
      email: string;
      picture?: string;
    },
  ): Promise<void> {
    const existingOauth = await this.authRepository.findOauthByGoogleProviderId(
      googleUser.sub,
    );

    if (existingOauth) {
      return;
    }

    await this.authRepository.createGoogleOauthLink({
      userId,
      providerUserId: googleUser.sub,
      email: googleUser.email.toLowerCase(),
      picture: googleUser.picture,
    });
  }

  private assertUserCanLogin(status: UserStatus): void {
    if (status === 'UNVERIFIED') {
      throw new UnauthorizedException('Please verify your email before login');
    }

    if (status === 'BANNED') {
      throw new UnauthorizedException('Your account is banned');
    }
  }

  private toAuthUser(user: {
    id: string;
    email: string;
    fullName: string;
    phone: string | null;
    role: UserRole;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
  }): AuthUser {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  private async findMatchingRefreshToken(
    tokens: Array<{ id: string; tokenHash: string; expiresAt: Date }>,
    refreshToken: string,
  ): Promise<{ id: string; tokenHash: string; expiresAt: Date } | null> {
    for (const token of tokens) {
      const matched = await bcrypt.compare(refreshToken, token.tokenHash);
      if (matched) {
        return token;
      }
    }

    return null;
  }

  private async sendWelcomeEmail(
    email: string,
    fullName: string,
  ): Promise<void> {
    try {
      const template =
        await this.mailTemplateService.buildWelcomeEmailTemplate(fullName);

      await this.mailService.sendMail({
        to: email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });
    } catch (error: unknown) {
      this.logger.warn(
        `Register succeeded but welcome email failed for ${email}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  private async sendVerifyEmail(
    userId: string,
    email: string,
    fullName: string,
    role: UserRole,
  ): Promise<void> {
    try {
      const tokenService = this.authTokenService as {
        issueEmailVerificationToken(input: {
          id: string;
          email: string;
          role: UserRole;
        }): Promise<string>;
      };
      const verifyToken = await tokenService.issueEmailVerificationToken({
        id: userId,
        email,
        role,
      });
      const verifyUrl = this.buildVerifyEmailUrl(verifyToken, role);
      const template = await this.mailTemplateService.buildVerifyEmailTemplate(
        fullName,
        verifyUrl,
      );

      await this.mailService.sendMail({
        to: email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });
    } catch (error: unknown) {
      this.logger.warn(
        `Register succeeded but verify email failed for ${email}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  private buildResetPasswordUrl(token: string, role: UserRole): string {
    const configKey =
      role === 'SELLER'
        ? 'FRONTEND_SELLER_RESET_PASSWORD_REDIRECT'
        : 'FRONTEND_RESET_PASSWORD_REDIRECT';
    const fallbackUrl =
      role === 'SELLER'
        ? FRONTEND_REDIRECT_URI_CONFIG_KEY.FRONTEND_SELLER_RESET_PASSWORD_REDIRECT
        : FRONTEND_REDIRECT_URI_CONFIG_KEY.FRONTEND_RESET_PASSWORD_REDIRECT;

    const baseUrl = this.configService.get<string>(configKey, fallbackUrl);

    return `${baseUrl}?token=${encodeURIComponent(token)}`;
  }

  private buildVerifyEmailUrl(token: string, role: UserRole): string {
    const configKey =
      role === 'SELLER'
        ? 'FRONTEND_SELLER_VERIFY_EMAIL_REDIRECT'
        : 'FRONTEND_VERIFY_EMAIL_REDIRECT';
    const fallbackUrl =
      role === 'SELLER'
        ? FRONTEND_REDIRECT_URI_CONFIG_KEY.FRONTEND_SELLER_VERIFY_EMAIL_REDIRECT
        : FRONTEND_REDIRECT_URI_CONFIG_KEY.FRONTEND_VERIFY_EMAIL_REDIRECT;

    const baseUrl = this.configService.get<string>(configKey, fallbackUrl);

    return `${baseUrl}?token=${encodeURIComponent(token)}`;
  }
}
