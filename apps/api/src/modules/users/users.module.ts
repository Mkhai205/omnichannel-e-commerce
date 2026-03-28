import { Module } from '@nestjs/common';
import { AdminUsersService } from './admin-users.service';
import { AdminUsersController } from './admin-users.controller';
import { UserProfileService } from './user-profile.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';

@Module({
  controllers: [UsersController, AdminUsersController],
  providers: [UsersRepository, UserProfileService, AdminUsersService],
  exports: [UserProfileService, AdminUsersService],
})
export class UsersModule {}
