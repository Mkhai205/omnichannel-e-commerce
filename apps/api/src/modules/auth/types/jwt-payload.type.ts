import type { UserRole } from '@repo/shared-types';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  tokenType: 'access' | 'refresh';
  jti?: string;
  iat?: number;
  exp?: number;
}
