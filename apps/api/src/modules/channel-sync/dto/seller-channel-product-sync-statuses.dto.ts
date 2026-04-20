import { ApiProperty } from '@nestjs/swagger';
import type {
  SalesChannelType,
  SellerChannelProductSyncStatusesRequest,
} from '@repo/shared-types';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsUUID,
} from 'class-validator';

const SALES_CHANNEL_TYPES: SalesChannelType[] = [
  'WEB',
  'TIKTOK_MOCK',
  'SHOPEE_MOCK',
];

export class SellerChannelProductSyncStatusesDto implements SellerChannelProductSyncStatusesRequest {
  @ApiProperty({
    isArray: true,
    type: String,
    format: 'uuid',
    maxItems: 100,
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(100)
  @IsUUID(undefined, { each: true })
  productIds!: string[];

  @ApiProperty({ enum: SALES_CHANNEL_TYPES })
  @IsIn(SALES_CHANNEL_TYPES)
  channelType!: SalesChannelType;
}
