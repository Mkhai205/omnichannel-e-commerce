import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { RegisterRequest, RegistrationRole } from '@repo/shared-types';

export const REGISTRATION_ROLES = {
  CUSTOMER: 'CUSTOMER',
  SELLER: 'SELLER',
} as const;

export class RegisterDto implements RegisterRequest {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8, maxLength: 128, example: 'StrongPass123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @ApiProperty({ minLength: 2, maxLength: 255, example: 'Nguyen Van A' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  fullName!: string;

  @ApiPropertyOptional({ maxLength: 20, example: '+84909123456' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ enum: Object.values(REGISTRATION_ROLES) })
  @IsOptional()
  @IsEnum(REGISTRATION_ROLES)
  role?: RegistrationRole;
}
