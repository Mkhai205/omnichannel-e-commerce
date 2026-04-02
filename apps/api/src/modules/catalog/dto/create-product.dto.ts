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
    example: 'products/4f4c2f31-2a86-4711-a893-6d26e9bdf3f5/main.jpg',
    maxLength: 500,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageKey?: string | null;

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
