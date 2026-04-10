import { ApiPropertyOptional } from '@nestjs/swagger';
import type { AddressType, UpdateAddressRequest } from '@repo/shared-types';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ADDRESS_TYPES } from './create-address.dto';

export class UpdateAddressDto implements UpdateAddressRequest {
  @ApiPropertyOptional({
    enum: Object.values(ADDRESS_TYPES),
    example: ADDRESS_TYPES.HOME,
  })
  @IsOptional()
  @IsEnum(ADDRESS_TYPES)
  type?: AddressType;

  @ApiPropertyOptional({
    minLength: 2,
    maxLength: 255,
    example: 'Nguyen Van A',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  recipientName?: string;

  @ApiPropertyOptional({ maxLength: 20, example: '+84909123456' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  recipientPhone?: string;

  @ApiPropertyOptional({
    minLength: 5,
    maxLength: 255,
    example: '123 Le Loi Street',
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  streetAddress?: string;

  @ApiPropertyOptional({ maxLength: 255, example: 'Ward 1, District 1' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  wardDistrict?: string;

  @ApiPropertyOptional({ maxLength: 100, example: 'Ho Chi Minh City' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ maxLength: 100, example: 'Ho Chi Minh' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({ maxLength: 20, example: '700000' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @ApiPropertyOptional({ maxLength: 100, example: 'Vietnam' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({
    description: 'Set this address as default',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
