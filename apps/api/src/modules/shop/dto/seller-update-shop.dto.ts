import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import type { SellerUpdateShopRequest } from '@repo/shared-types';

export class SellerUpdateShopDto implements SellerUpdateShopRequest {
  @ApiPropertyOptional({ minLength: 3, maxLength: 255, example: 'My Shop' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  shopName?: string;

  @ApiPropertyOptional({ maxLength: 1000, example: 'Welcome to my shop!' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    maxLength: 500,
    example: 'shops/4f4c2f31-2a86-4711-a893-6d26e9bdf3f5/avatar.jpg',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatarKey?: string | null;

  @ApiPropertyOptional({
    maxLength: 255,
    example: 'https://minio.local/licenses/shop-license.png',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  businessLicense?: string;
}
