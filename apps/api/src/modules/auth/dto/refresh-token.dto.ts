import { IsOptional, IsString, MaxLength } from 'class-validator';
import type { RefreshTokenRequest } from '@repo/shared-types';

export class RefreshTokenDto implements RefreshTokenRequest {
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  refreshToken?: string;
}
