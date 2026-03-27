import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import type { LogoutRequest } from '@repo/shared-types';

export class LogoutDto implements LogoutRequest {
  @ApiPropertyOptional({
    maxLength: 2048,
    description:
      'Optional when refresh token is sent via cookie. Provide value for non-cookie clients.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  refreshToken?: string;

  @ApiPropertyOptional({
    default: false,
    description: 'If true, revoke all active sessions for current user.',
  })
  @IsOptional()
  @IsBoolean()
  logoutAll?: boolean;
}
