import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import type { UpdateUserRoleRequest, UserRole } from '@repo/shared-types';
import { USER_ROLES } from './admin-users-filter.dto';

export class UpdateUserRoleDto implements UpdateUserRoleRequest {
  @ApiProperty({ enum: Object.values(USER_ROLES) })
  @IsEnum(USER_ROLES)
  role!: UserRole;
}
