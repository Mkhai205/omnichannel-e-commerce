import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import type { CreateSellerInventoryAdjustmentRequest } from '@repo/shared-types';

export class CreateSellerInventoryAdjustmentDto implements CreateSellerInventoryAdjustmentRequest {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  warehouseId?: string;

  @ApiProperty({ enum: ['IMPORT', 'EXPORT', 'RETURN'] })
  @IsIn(['IMPORT', 'EXPORT', 'RETURN'])
  type!: 'IMPORT' | 'EXPORT' | 'RETURN';

  @ApiProperty({ minimum: 1, maximum: 1000000 })
  @IsInt()
  @Min(1)
  @Max(1000000)
  quantity!: number;

  @ApiPropertyOptional({
    maxLength: 500,
    example: 'Manual stock adjustment after counting',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
