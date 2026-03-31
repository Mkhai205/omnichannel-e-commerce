import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import type { CreateProductRequest } from '@repo/shared-types';

export class CreateProductDto implements CreateProductRequest {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  categoryId!: string;

  @ApiProperty({ maxLength: 255, example: 'iPhone 16 Pro Max' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({ example: 'San pham moi 2026' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: ['DRAFT', 'ACTIVE', 'HIDDEN'],
    default: 'DRAFT',
  })
  @IsOptional()
  @IsIn(['DRAFT', 'ACTIVE', 'HIDDEN'])
  status?: 'DRAFT' | 'ACTIVE' | 'HIDDEN';

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: { type: 'string' },
    example: { tiktok: 'pending', lazada: 'success' },
  })
  @IsOptional()
  @IsObject()
  omnichannelSyncStatus?: Record<string, string>;
}
