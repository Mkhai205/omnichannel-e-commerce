import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import type { UpdateProductRequest } from '@repo/shared-types';

export class UpdateProductDto implements UpdateProductRequest {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ maxLength: 255, example: 'iPhone 16 Pro Max' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ example: 'Cap nhat mo ta san pham' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'products/4f4c2f31-2a86-4711-a893-6d26e9bdf3f5/main.jpg',
    maxLength: 500,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageKey?: string | null;

  @ApiPropertyOptional({ enum: ['DRAFT', 'ACTIVE', 'HIDDEN'] })
  @IsOptional()
  @IsIn(['DRAFT', 'ACTIVE', 'HIDDEN'])
  status?: 'DRAFT' | 'ACTIVE' | 'HIDDEN';

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: { type: 'string' },
    example: { tiktok: 'failed' },
  })
  @IsOptional()
  @IsObject()
  omnichannelSyncStatus?: Record<string, string>;
}
