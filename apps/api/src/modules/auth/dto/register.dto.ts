import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { RegisterRequest, RegistrationRole } from '@repo/shared-types';

export const REGISTRATION_ROLES = {
  CUSTOMER: 'CUSTOMER',
  SELLER: 'SELLER',
} as const;

export class RegisterDto implements RegisterRequest {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  fullName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsEnum(REGISTRATION_ROLES)
  role?: RegistrationRole;
}
