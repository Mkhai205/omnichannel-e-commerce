import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
import { AuthGoogleService } from './auth-google.service';
import { AuthRepository } from './auth.repository';
import { AuthTokenService } from './auth-token.service';
import { REGISTRATION_ROLES } from './dto/register.dto';

interface RequestMeta {
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly authTokenService: AuthTokenService,
    private readonly authGoogleService: AuthGoogleService,
  ) {}

  async register(
    input: RegisterRequest,
    meta: RequestMeta,
  ): Promise<RegisterResponse> {
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
      status: 'ACTIVE',
    });

    const tokens = await this.authTokenService.issueTokenPair(user, meta);

    return {
      ...tokens,
      user: this.toAuthUser(user),
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
  ): Promise<LoginResponse> {
    const googleUser = await this.authGoogleService.fetchGoogleUserInfo(code);
    const normalizedEmail = googleUser.email.toLowerCase();

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
      });
    } else {
      await this.ensureGoogleAccountLinked(user.id, googleUser);
    }

    this.assertUserCanLogin(user.status);

    const tokens = await this.authTokenService.issueTokenPair(user, meta);

    return {
      ...tokens,
      user: this.toAuthUser(user),
    };
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
}
