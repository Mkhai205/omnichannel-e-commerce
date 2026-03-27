import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@repo/shared-types';
import { ROLES_KEY } from '../../modules/auth/utils/auth.constants';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
