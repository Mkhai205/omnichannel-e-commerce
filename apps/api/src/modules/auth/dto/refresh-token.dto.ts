import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import type { RefreshTokenRequest } from '@repo/shared-types';

export class RefreshTokenDto implements RefreshTokenRequest {
  @ApiPropertyOptional({
    maxLength: 2048,
    description:
      'Optional when refresh token is sent via cookie. Provide value for non-cookie clients.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  refreshToken?: string;
}
