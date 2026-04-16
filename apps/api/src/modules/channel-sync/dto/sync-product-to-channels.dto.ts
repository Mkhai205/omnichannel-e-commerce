import { ApiProperty } from '@nestjs/swagger';
import type {
  SalesChannelType,
  SyncProductToChannelsRequest,
} from '@repo/shared-types';
import { ArrayNotEmpty, IsArray, IsIn, IsUUID } from 'class-validator';

const SALES_CHANNEL_TYPES: SalesChannelType[] = [
  'WEB',
  'TIKTOK_MOCK',
  'SHOPEE_MOCK',
];

export class SyncProductToChannelsDto implements SyncProductToChannelsRequest {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  productId!: string;

  @ApiProperty({
    isArray: true,
    enum: SALES_CHANNEL_TYPES,
    example: ['TIKTOK_MOCK', 'SHOPEE_MOCK'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsIn(SALES_CHANNEL_TYPES, { each: true })
  channelTypes!: SalesChannelType[];
}
