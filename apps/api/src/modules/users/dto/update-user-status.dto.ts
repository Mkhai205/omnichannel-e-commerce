import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import type { UpdateUserStatusRequest, UserStatus } from '@repo/shared-types';
import { USER_STATUSES } from './admin-users-filter.dto';

export class UpdateUserStatusDto implements UpdateUserStatusRequest {
  @ApiProperty({ enum: Object.values(USER_STATUSES) })
  @IsEnum(USER_STATUSES)
  status!: UserStatus;
}
