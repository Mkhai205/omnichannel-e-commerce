import { ApiPropertyOptional } from '@nestjs/swagger';
import type { ConnectSellerChannelRequest } from '@repo/shared-types';
import { IsISO8601, IsOptional, IsString, MaxLength } from 'class-validator';

export class ConnectSellerChannelDto implements ConnectSellerChannelRequest {
  @ApiPropertyOptional({
    example: 'tiktok-shop-demo-001',
    description: 'External shop id at channel provider',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  externalShopId?: string;

  @ApiPropertyOptional({
    example: 'mock-access-token',
    description: 'Mock access token for demo integration',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  accessToken?: string;

  @ApiPropertyOptional({
    example: 'mock-refresh-token',
    description: 'Mock refresh token for demo integration',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  refreshToken?: string;

  @ApiPropertyOptional({
    example: '2026-04-20T10:00:00.000Z',
    description: 'Token expiry timestamp in ISO format',
  })
  @IsOptional()
  @IsISO8601()
  tokenExpiresAt?: string;
}
