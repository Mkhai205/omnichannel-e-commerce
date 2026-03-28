import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import type {
  AdminUpdateShopStatusRequest,
  ShopStatus,
} from '@repo/shared-types';
import { SHOP_STATUSES } from './admin-shops-filter.dto';

export class AdminUpdateShopStatusDto implements AdminUpdateShopStatusRequest {
  @ApiProperty({ enum: Object.values(SHOP_STATUSES) })
  @IsEnum(SHOP_STATUSES)
  status!: ShopStatus;

  @ApiPropertyOptional({
    maxLength: 500,
    example: 'Incomplete business verification documents',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  rejectionReason?: string;
}
