import { ApiPropertyOptional } from '@nestjs/swagger';
import type { CustomerOrdersFilterRequest } from '@repo/shared-types';
import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsString, Max, Min } from 'class-validator';

const ORDER_STATUS_OPTIONS = [
  'PENDING_PAYMENT',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
] as const;

export class CustomerOrdersFilterDto implements CustomerOrdersFilterRequest {
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
}
