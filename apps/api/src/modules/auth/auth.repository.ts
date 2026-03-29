import { Injectable } from '@nestjs/common';
import {
  AUTH_PROVIDER,
  type UserRole,
  type UserStatus,
} from '@repo/shared-types';
import { PrismaService } from '../../infrastructure/database/prisma.service';

interface CreateLocalUserInput {
  email: string;
  passwordHash: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
}

interface CreateGoogleUserInput {
  email: string;
  fullName: string;
  providerUserId: string;
  picture?: string;
}

interface CreateRefreshTokenInput {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findUserByIdWithActiveRefreshTokens(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        refreshTokens: {
          where: { revokedAt: null },
        },
      },
    });
  }

  findUserByGoogleProviderId(providerUserId: string) {
    return this.prisma.user.findFirst({
      where: {
        oauthAccounts: {
          some: {
            provider: AUTH_PROVIDER.GOOGLE,
            providerUserId,
          },
        },
      },
    });
  }

  createLocalUser(input: CreateLocalUserInput) {
    return this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        fullName: input.fullName,
        phone: input.phone ?? null,
        role: input.role,
        status: input.status,
      },
    });
  }

  createGoogleUser(input: CreateGoogleUserInput) {
    const role: UserRole = 'CUSTOMER';
    const status: UserStatus = 'ACTIVE';

    return this.prisma.user.create({
      data: {
        email: input.email,
        fullName: input.fullName,
        role,
        status,
        oauthAccounts: {
          create: {
            provider: AUTH_PROVIDER.GOOGLE,
            providerUserId: input.providerUserId,
            email: input.email,
            picture: input.picture ?? null,
          },
        },
      },
    });
  }

  findOauthByGoogleProviderId(providerUserId: string) {
    return this.prisma.oauthAccount.findFirst({
      where: {
        provider: AUTH_PROVIDER.GOOGLE,
        providerUserId,
      },
    });
  }

  createGoogleOauthLink(input: {
    userId: string;
    providerUserId: string;
    email: string;
    picture?: string;
  }) {
    return this.prisma.oauthAccount.create({
      data: {
        userId: input.userId,
        provider: AUTH_PROVIDER.GOOGLE,
        providerUserId: input.providerUserId,
        email: input.email,
        picture: input.picture ?? null,
      },
    });
  }

  createRefreshToken(input: CreateRefreshTokenInput) {
    return this.prisma.refreshToken.create({
      data: {
        userId: input.userId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
        userAgent: input.userAgent,
        ipAddress: input.ipAddress,
      },
    });
  }

  findActiveRefreshTokensByUserId(userId: string) {
    return this.prisma.refreshToken.findMany({
      where: {
        userId,
        revokedAt: null,
      },
    });
  }

  revokeRefreshTokenById(id: string) {
    return this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  revokeAllActiveRefreshTokensByUserId(userId: string) {
    return this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  updateUserPasswordById(userId: string, passwordHash: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  activateUserById(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { status: 'ACTIVE' },
    });
  }
}
