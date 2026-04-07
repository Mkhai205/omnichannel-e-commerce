import { ApiPropertyOptional } from '@nestjs/swagger';
import type { SellerOrdersFilterRequest } from '@repo/shared-types';
import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsString, Matches, Max, Min } from 'class-validator';

const ORDER_STATUS_OPTIONS = [
  'PENDING_PAYMENT',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
] as const;

export class SellerOrdersFilterDto implements SellerOrdersFilterRequest {
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

  @ApiPropertyOptional({ enum: ORDER_STATUS_OPTIONS })
  @IsOptional()
  @IsIn(ORDER_STATUS_OPTIONS)
  status?: (typeof ORDER_STATUS_OPTIONS)[number];

  @ApiPropertyOptional({ example: 'ORD-2026' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: '2026-04-01', description: 'YYYY-MM-DD' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  placedFrom?: string;

  @ApiPropertyOptional({ example: '2026-04-30', description: 'YYYY-MM-DD' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  placedTo?: string;
}
