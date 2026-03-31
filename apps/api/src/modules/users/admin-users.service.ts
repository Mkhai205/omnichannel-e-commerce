import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  AdminUserListItem,
  AdminUserListResponse,
  AdminUsersFilterRequest,
  AuthUser,
  UpdateUserRoleRequest,
  UpdateUserStatusRequest,
} from '@repo/shared-types';
import type { SafeUserRecord } from './users.repository';
import { UsersRepository } from './users.repository';

@Injectable()
export class AdminUsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAdminUsers(
    filters: AdminUsersFilterRequest,
  ): Promise<AdminUserListResponse> {
    const page = this.resolvePage(filters.page);
    const limit = this.resolveLimit(filters.limit);
    const search = filters.search?.trim();

    const query = {
      page,
      limit,
      search,
      role: filters.role,
      status: filters.status,
    };

    const [users, totalItems] = await Promise.all([
      this.usersRepository.findAdminUsers(query),
      this.usersRepository.countAdminUsers(query),
    ]);

    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);

    return {
      data: users.map((user) => this.toAdminUser(user)),
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  async getAdminUserById(userId: string): Promise<AuthUser> {
    const user = await this.usersRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toAuthUser(user);
  }

  async updateAdminUserStatus(
    userId: string,
    payload: UpdateUserStatusRequest,
  ): Promise<AuthUser> {
    const user = await this.usersRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.usersRepository.updateUserById(userId, {
      status: payload.status,
    });

    return this.toAuthUser(updatedUser);
  }

  async updateAdminUserRole(
    userId: string,
    payload: UpdateUserRoleRequest,
  ): Promise<AuthUser> {
    const user = await this.usersRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.usersRepository.updateUserById(userId, {
      role: payload.role,
    });

    return this.toAuthUser(updatedUser);
  }

  private resolvePage(page?: number): number {
    if (!page || Number.isNaN(page) || page < 1) {
      return 1;
    }

    return page;
  }

  private resolveLimit(limit?: number): number {
    if (!limit || Number.isNaN(limit) || limit < 1) {
      return 20;
    }

    if (limit > 100) {
      return 100;
    }

    return limit;
  }

  private toAuthUser(user: SafeUserRecord): AuthUser {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  private toAdminUser(user: SafeUserRecord): AdminUserListItem {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
