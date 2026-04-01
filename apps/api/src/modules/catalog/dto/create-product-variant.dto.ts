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

  @ApiPropertyOptional({ minimum: 0, maximum: 1000000, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000000)
  stockQuantity?: number;
}
