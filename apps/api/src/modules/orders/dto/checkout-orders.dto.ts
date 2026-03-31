import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import type { CheckoutOrdersRequest } from '@repo/shared-types';

export class CheckoutOrdersDto implements CheckoutOrdersRequest {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  shippingAddressId!: string;

  @ApiProperty({
    type: [String],
    example: [
      '9f8b3eb3-c3a7-4ff0-842a-7d1a9784e38e',
      'd241f933-4f9a-41bd-8ba9-e7f5ecdf93f0',
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  cartItemIds!: string[];

  @ApiPropertyOptional({
    maxLength: 1000,
    example: 'Please deliver in office hours.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}
