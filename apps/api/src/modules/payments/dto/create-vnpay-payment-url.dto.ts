import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import type { CreateVnpayPaymentUrlRequest } from '@repo/shared-types';

export class CreateVnpayPaymentUrlDto implements CreateVnpayPaymentUrlRequest {
  @ApiProperty({
    type: [String],
    example: [
      '1f09f8eb-2a14-4348-9ba5-19de6ec3285c',
      '8f86e5de-f746-4f6f-a90b-85f25ec91f53',
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  orderIds!: string[];

  @ApiPropertyOptional({ example: 'NCB', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  bankCode?: string;

  @ApiPropertyOptional({ enum: ['vn', 'en'], default: 'vn' })
  @IsOptional()
  @IsIn(['vn', 'en'])
  locale?: 'vn' | 'en';
}
