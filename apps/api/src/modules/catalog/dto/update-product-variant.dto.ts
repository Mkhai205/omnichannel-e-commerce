import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import type { UpdateProductVariantRequest } from '@repo/shared-types';

export class UpdateProductVariantDto implements UpdateProductVariantRequest {
  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: { type: 'string' },
    example: { color: 'Blue', storage: '512GB' },
  })
  @IsOptional()
  @IsObject()
  attributes?: Record<string, string>;

  @ApiPropertyOptional({
    example: '35990000',
    description: 'Decimal string with up to 2 fraction digits',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'price must be a decimal string with up to 2 fractional digits',
  })
  price?: string;

  @ApiPropertyOptional({
    example:
      'products/4f4c2f31-2a86-4711-a893-6d26e9bdf3f5/variants/5f19831d-23de-4d7e-a3f8-f4f98978cbce.jpg',
    maxLength: 500,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageKey?: string | null;

  @ApiPropertyOptional({ minimum: 0, maximum: 1000000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000000)
  stockQuantity?: number;
}
