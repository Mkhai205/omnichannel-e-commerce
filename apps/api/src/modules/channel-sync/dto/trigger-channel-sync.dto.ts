import { ApiPropertyOptional } from '@nestjs/swagger';
import type { TriggerChannelSyncRequest } from '@repo/shared-types';
import { IsIn, IsOptional } from 'class-validator';

const CHANNEL_SYNC_DIRECTIONS = [
  'IMPORT_ORDERS',
  'EXPORT_PRODUCTS',
  'EXPORT_INVENTORY',
] as const;

const CHANNEL_SYNC_TRIGGERS = ['MANUAL', 'CRON'] as const;

export class TriggerChannelSyncDto implements TriggerChannelSyncRequest {
  @ApiPropertyOptional({
    enum: CHANNEL_SYNC_DIRECTIONS,
    default: 'IMPORT_ORDERS',
  })
  @IsIn(CHANNEL_SYNC_DIRECTIONS)
  direction!: (typeof CHANNEL_SYNC_DIRECTIONS)[number];

  @ApiPropertyOptional({ enum: CHANNEL_SYNC_TRIGGERS, default: 'MANUAL' })
  @IsOptional()
  @IsIn(CHANNEL_SYNC_TRIGGERS)
  trigger?: (typeof CHANNEL_SYNC_TRIGGERS)[number];
}
