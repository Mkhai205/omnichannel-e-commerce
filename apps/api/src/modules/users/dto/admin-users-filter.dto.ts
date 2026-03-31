import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import type {
  AdminUsersFilterRequest,
  UserRole,
  UserStatus,
} from '@repo/shared-types';

export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN',
} as const;

export const USER_STATUSES = {
  ACTIVE: 'ACTIVE',
  BANNED: 'BANNED',
  UNVERIFIED: 'UNVERIFIED',
} as const;

export class AdminUsersFilterDto implements AdminUsersFilterRequest {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Search by email, full name, or phone',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() || undefined : undefined,
  )
  search?: string;

  @ApiPropertyOptional({ enum: Object.values(USER_ROLES) })
  @IsOptional()
  @IsEnum(USER_ROLES)
  role?: UserRole;

  @ApiPropertyOptional({ enum: Object.values(USER_STATUSES) })
  @IsOptional()
  @IsEnum(USER_STATUSES)
  status?: UserStatus;
}
