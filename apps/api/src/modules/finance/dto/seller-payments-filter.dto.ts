import { ApiPropertyOptional } from '@nestjs/swagger';
import type {
  SellerAnalyticsFilterRequest,
  SellerPaymentsFilterRequest,
} from '@repo/shared-types';
import { Type } from 'class-transformer';
import { IsIn, IsOptional, Max, Min } from 'class-validator';

const SELLER_PAYMENT_FILTER_STATUS = [
  'all',
  'settled',
  'pending',
  'mismatch',
] as const;

const SELLER_ANALYTICS_TIME_RANGE = ['today', '7days', '30days'] as const;

export class SellerPaymentsFilterDto implements SellerPaymentsFilterRequest {
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

  @ApiPropertyOptional({ enum: SELLER_PAYMENT_FILTER_STATUS })
  @IsOptional()
  @IsIn(SELLER_PAYMENT_FILTER_STATUS)
  status?: (typeof SELLER_PAYMENT_FILTER_STATUS)[number];
}

export class SellerAnalyticsFilterDto implements SellerAnalyticsFilterRequest {
  @ApiPropertyOptional({ enum: SELLER_ANALYTICS_TIME_RANGE, default: '30days' })
  @IsOptional()
  @IsIn(SELLER_ANALYTICS_TIME_RANGE)
  timeRange?: (typeof SELLER_ANALYTICS_TIME_RANGE)[number];
}
