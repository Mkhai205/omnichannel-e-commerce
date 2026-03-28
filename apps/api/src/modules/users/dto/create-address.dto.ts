import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { AddressType, CreateAddressRequest } from '@repo/shared-types';

export const ADDRESS_TYPES = {
  HOME: 'HOME',
  WORK: 'WORK',
  OTHER: 'OTHER',
} as const;

export class CreateAddressDto implements CreateAddressRequest {
  @ApiProperty({
    enum: Object.values(ADDRESS_TYPES),
    example: ADDRESS_TYPES.HOME,
  })
  @IsEnum(ADDRESS_TYPES)
  type!: AddressType;

  @ApiProperty({ minLength: 2, maxLength: 255, example: 'Nguyen Van A' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  recipientName!: string;

  @ApiProperty({ maxLength: 20, example: '+84909123456' })
  @IsString()
  @MaxLength(20)
  recipientPhone!: string;

  @ApiProperty({ minLength: 5, maxLength: 255, example: '123 Le Loi Street' })
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  streetAddress!: string;

  @ApiPropertyOptional({ maxLength: 255, example: 'Ward 1, District 1' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  wardDistrict?: string;

  @ApiProperty({ maxLength: 100, example: 'Ho Chi Minh City' })
  @IsString()
  @MaxLength(100)
  city!: string;

  @ApiProperty({ maxLength: 100, example: 'Ho Chi Minh' })
  @IsString()
  @MaxLength(100)
  state!: string;

  @ApiProperty({ maxLength: 20, example: '700000' })
  @IsString()
  @MaxLength(20)
  postalCode!: string;

  @ApiProperty({ maxLength: 100, example: 'Vietnam' })
  @IsString()
  @MaxLength(100)
  country!: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
