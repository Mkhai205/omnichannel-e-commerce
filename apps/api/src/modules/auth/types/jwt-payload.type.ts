import type { UserRole } from '@repo/shared-types';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  tokenType: 'access' | 'refresh' | 'password_reset' | 'email_verify';
  jti?: string;
  iat?: number;
  exp?: number;
}
