import { ApiPropertyOptional } from '@nestjs/swagger';
import type {
  SalesChannelType,
  SellerChannelSyncRunsFilterRequest,
} from '@repo/shared-types';
import { Type } from 'class-transformer';
import { IsIn, IsOptional, Max, Min } from 'class-validator';

const CHANNEL_TYPES = ['WEB', 'TIKTOK_MOCK', 'SHOPEE_MOCK'] as const;
const CHANNEL_SYNC_DIRECTIONS = [
  'IMPORT_ORDERS',
  'EXPORT_PRODUCTS',
  'EXPORT_INVENTORY',
] as const;
const CHANNEL_SYNC_STATUSES = ['SUCCESS', 'PARTIAL', 'FAILED'] as const;

export class SellerChannelSyncRunsFilterDto implements SellerChannelSyncRunsFilterRequest {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ enum: CHANNEL_TYPES })
  @IsOptional()
  @IsIn(CHANNEL_TYPES)
  channelType?: SalesChannelType;

  @ApiPropertyOptional({ enum: CHANNEL_SYNC_DIRECTIONS })
  @IsOptional()
  @IsIn(CHANNEL_SYNC_DIRECTIONS)
  direction?: (typeof CHANNEL_SYNC_DIRECTIONS)[number];

  @ApiPropertyOptional({ enum: CHANNEL_SYNC_STATUSES })
  @IsOptional()
  @IsIn(CHANNEL_SYNC_STATUSES)
  status?: (typeof CHANNEL_SYNC_STATUSES)[number];
}
