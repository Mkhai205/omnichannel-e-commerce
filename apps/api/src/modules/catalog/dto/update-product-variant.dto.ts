import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Max,
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

  @ApiPropertyOptional({ minimum: 0, maximum: 1000000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000000)
  stockQuantity?: number;
}
