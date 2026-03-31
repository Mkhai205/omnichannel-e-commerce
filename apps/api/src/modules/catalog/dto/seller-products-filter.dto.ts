import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import type { SellerProductsFilterRequest } from '@repo/shared-types';

export class SellerProductsFilterDto implements SellerProductsFilterRequest {
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

  @ApiPropertyOptional({ example: 'iphone' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ enum: ['DRAFT', 'ACTIVE', 'HIDDEN'] })
  @IsOptional()
  @IsIn(['DRAFT', 'ACTIVE', 'HIDDEN'])
  status?: 'DRAFT' | 'ACTIVE' | 'HIDDEN';
}
