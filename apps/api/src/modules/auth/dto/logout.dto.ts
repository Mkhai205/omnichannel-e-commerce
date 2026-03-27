import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import type { LogoutRequest } from '@repo/shared-types';

export class LogoutDto implements LogoutRequest {
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  refreshToken?: string;

  @IsOptional()
  @IsBoolean()
  logoutAll?: boolean;
}
