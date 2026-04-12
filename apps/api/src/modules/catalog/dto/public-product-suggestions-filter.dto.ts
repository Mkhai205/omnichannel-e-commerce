import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import type { PublicProductSuggestionsRequest } from '@repo/shared-types';

export class PublicProductSuggestionsFilterDto implements PublicProductSuggestionsRequest {
  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description:
      'Opaque cursor token returned from previous suggestions response',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  cursor?: string;

  @ApiProperty({
    description:
      'Stable session key for deterministic suggestion order during one user session',
    minLength: 8,
    maxLength: 200,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(200)
  sessionKey!: string;

  @ApiPropertyOptional({ example: 'iphone' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  shopId?: string;
}
