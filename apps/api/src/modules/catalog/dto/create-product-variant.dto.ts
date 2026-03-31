import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import type { CreateProductVariantRequest } from '@repo/shared-types';

export class CreateProductVariantDto implements CreateProductVariantRequest {
  @ApiProperty({ maxLength: 100, example: 'IP16PM-256-BLACK' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sku!: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'string' },
    example: { color: 'Black', storage: '256GB' },
  })
  @IsObject()
  attributes!: Record<string, string>;

  @ApiProperty({
    example: '32990000',
    description: 'Decimal string with up to 2 fraction digits',
  })
  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'price must be a decimal string with up to 2 fractional digits',
  })
  price!: string;

  @ApiPropertyOptional({ minimum: 0, maximum: 1000000, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000000)
  stockQuantity?: number;
}
