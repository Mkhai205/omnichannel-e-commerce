import { ApiPropertyOptional } from '@nestjs/swagger';
import type { SellerPaymentsFilterRequest } from '@repo/shared-types';
import { Type } from 'class-transformer';
import { IsIn, IsOptional, Max, Min } from 'class-validator';

const SELLER_PAYMENT_FILTER_STATUS = [
  'all',
  'settled',
  'pending',
  'mismatch',
] as const;

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
