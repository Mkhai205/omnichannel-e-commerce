import { ApiPropertyOptional } from '@nestjs/swagger';
import type {
  AdminPaymentsFilterRequest,
  AdminSettlementsFilterRequest,
} from '@repo/shared-types';
import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsString, Matches, Max, Min } from 'class-validator';

const PAYMENT_STATUS_OPTIONS = [
  'PENDING',
  'SUCCESS',
  'FAILED',
  'CANCELLED',
] as const;
const PAYMENT_PROVIDER_OPTIONS = ['VNPAY'] as const;
const SETTLEMENT_STATUS_OPTIONS = ['COMPLETED', 'REVERSED'] as const;

export class AdminPaymentsFilterDto implements AdminPaymentsFilterRequest {
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

  @ApiPropertyOptional({ example: 'TXN-2026' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: PAYMENT_STATUS_OPTIONS })
  @IsOptional()
  @IsIn(PAYMENT_STATUS_OPTIONS)
  status?: (typeof PAYMENT_STATUS_OPTIONS)[number];

  @ApiPropertyOptional({ enum: PAYMENT_PROVIDER_OPTIONS })
  @IsOptional()
  @IsIn(PAYMENT_PROVIDER_OPTIONS)
  provider?: (typeof PAYMENT_PROVIDER_OPTIONS)[number];

  @ApiPropertyOptional({ example: '2026-04-01', description: 'YYYY-MM-DD' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  createdFrom?: string;

  @ApiPropertyOptional({ example: '2026-04-30', description: 'YYYY-MM-DD' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  createdTo?: string;
}

export class AdminSettlementsFilterDto implements AdminSettlementsFilterRequest {
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

  @ApiPropertyOptional({ example: 'ORD-2026' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: SETTLEMENT_STATUS_OPTIONS })
  @IsOptional()
  @IsIn(SETTLEMENT_STATUS_OPTIONS)
  status?: (typeof SETTLEMENT_STATUS_OPTIONS)[number];

  @ApiPropertyOptional({ example: '2026-04-01', description: 'YYYY-MM-DD' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  settledFrom?: string;

  @ApiPropertyOptional({ example: '2026-04-30', description: 'YYYY-MM-DD' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  settledTo?: string;
}
