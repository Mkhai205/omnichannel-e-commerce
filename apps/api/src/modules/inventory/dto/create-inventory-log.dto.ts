import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import type { CreateInventoryLogRequest } from '@repo/shared-types';

export class CreateInventoryLogDto implements CreateInventoryLogRequest {
  @ApiProperty({ enum: ['IMPORT', 'EXPORT', 'RETURN', 'ORDER_DEDUCT'] })
  @IsIn(['IMPORT', 'EXPORT', 'RETURN', 'ORDER_DEDUCT'])
  type!: 'IMPORT' | 'EXPORT' | 'RETURN' | 'ORDER_DEDUCT';

  @ApiProperty({ minimum: -1000000, maximum: 1000000 })
  @IsInt()
  @Min(-1000000)
  @Max(1000000)
  quantityChanged!: number;

  @ApiPropertyOptional({
    maxLength: 500,
    example: 'Manual stock adjustment after counting',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
