import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import type { SellerCreateShopOnboardingRequest } from '@repo/shared-types';

export class SellerCreateShopDto implements SellerCreateShopOnboardingRequest {
  @ApiProperty({ minLength: 3, maxLength: 255, example: 'My Shop' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  shopName!: string;

  @ApiPropertyOptional({ maxLength: 1000, example: 'Welcome to my shop!' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    maxLength: 255,
    example: 'https://minio.local/licenses/shop-license.png',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  businessLicense?: string;
}
