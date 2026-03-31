import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { AuthTokens, UserRole, UserStatus } from '@repo/shared-types';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { AuthRepository } from './auth.repository';
import type { JwtPayload } from './types/jwt-payload.type';
import {
  AUTH_COOKIE_CONFIG_KEY,
  JWT_CONFIG_KEY,
} from 'src/core/config/env.constant';

interface RequestMeta {
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getAccessTokenCookieName(): string {
    return this.configService.get<string>(
      'AUTH_COOKIE_ACCESS_NAME',
      AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_ACCESS_NAME,
    );
  }

  getRefreshTokenCookieName(): string {
    return this.configService.get<string>(
      'AUTH_COOKIE_REFRESH_NAME',
      AUTH_COOKIE_CONFIG_KEY.AUTH_COOKIE_REFRESH_NAME,
    );
  }

  getAccessCookieMaxAgeMs(): number {
    return this.getAccessExpiresInSeconds() * 1000;
  }

  getRefreshCookieMaxAgeMs(): number {
    return this.getRefreshExpiresInSeconds() * 1000;
  }

  isSecureCookie(): boolean {
    return (
      this.configService.get<string>('NODE_ENV', 'development') === 'production'
    );
  }

  async verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.getRefreshSecret(),
        },
      );

      if (payload.tokenType !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async verifyPasswordResetToken(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.getAccessSecret(),
      });

      if (payload.tokenType !== 'password_reset') {
        throw new UnauthorizedException('Invalid reset password token');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid reset password token');
    }
  }

  async verifyEmailVerificationToken(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.getAccessSecret(),
      });

      if (payload.tokenType !== 'email_verify') {
        throw new UnauthorizedException('Invalid email verification token');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid email verification token');
    }
  }

  async issueTokenPair(
    user: {
      id: string;
      email: string;
      role: UserRole;
      status: UserStatus;
    },
    meta: RequestMeta,
  ): Promise<AuthTokens> {
    const accessPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tokenType: 'access',
    };

    const refreshPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tokenType: 'refresh',
      jti: randomUUID(),
    };

    const accessExpiresInSeconds = this.getAccessExpiresInSeconds();
    const refreshExpiresInSeconds = this.getRefreshExpiresInSeconds();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.getAccessSecret(),
        expiresIn: accessExpiresInSeconds,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.getRefreshSecret(),
        expiresIn: refreshExpiresInSeconds,
      }),
    ]);

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await this.authRepository.createRefreshToken({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + refreshExpiresInSeconds * 1000),
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
    });

    return {
      accessToken,
      refreshToken,
      expiresInSeconds: accessExpiresInSeconds,
    };
  }

  async issuePasswordResetToken(user: {
    id: string;
    email: string;
    role: UserRole;
  }): Promise<string> {
    const resetPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tokenType: 'password_reset',
      jti: randomUUID(),
    };

    return this.jwtService.signAsync(resetPayload, {
      secret: this.getAccessSecret(),
      expiresIn: this.getResetPasswordTokenExpiresInSeconds(),
    });
  }

  async issueEmailVerificationToken(user: {
    id: string;
    email: string;
    role: UserRole;
  }): Promise<string> {
    const verifyPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tokenType: 'email_verify',
      jti: randomUUID(),
    };

    return this.jwtService.signAsync(verifyPayload, {
      secret: this.getAccessSecret(),
      expiresIn: this.getVerifyEmailTokenExpiresInSeconds(),
    });
  }

  private getAccessExpiresInSeconds(): number {
    return this.configService.get<number>(
      'JWT_ACCESS_EXPIRES_IN_SECONDS',
      JWT_CONFIG_KEY.JWT_ACCESS_EXPIRES_IN_SECONDS,
    );
  }

  private getRefreshExpiresInSeconds(): number {
    return this.configService.get<number>(
      'JWT_REFRESH_EXPIRES_IN_SECONDS',
      JWT_CONFIG_KEY.JWT_REFRESH_EXPIRES_IN_SECONDS,
    );
  }

  private getResetPasswordTokenExpiresInSeconds(): number {
    return this.configService.get<number>(
      'RESET_PASSWORD_TOKEN_EXPIRES_IN_SECONDS',
      JWT_CONFIG_KEY.RESET_PASSWORD_TOKEN_EXPIRES_IN_SECONDS,
    );
  }

  private getVerifyEmailTokenExpiresInSeconds(): number {
    return this.configService.get<number>(
      'VERIFY_EMAIL_TOKEN_EXPIRES_IN_SECONDS',
      JWT_CONFIG_KEY.VERIFY_EMAIL_TOKEN_EXPIRES_IN_SECONDS,
    );
  }

  private getAccessSecret(): string {
    return this.configService.get<string>('JWT_ACCESS_SECRET', '');
  }

  private getRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET', '');
  }
}
