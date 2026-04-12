import { Injectable } from '@nestjs/common';
import { Prisma } from '@repo/database';
import type { UserRole, UserStatus } from '@repo/shared-types';
import { PrismaService } from '../../infrastructure/database/prisma.service';

const USER_SELECT = {
  id: true,
  email: true,
  fullName: true,
  phone: true,
  role: true,
  status: true,
  shop: {
    select: {
      id: true,
      shopName: true,
      avatarKey: true,
    },
  },
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

const ADDRESS_SELECT = {
  id: true,
  userId: true,
  type: true,
  recipientName: true,
  recipientPhone: true,
  streetAddress: true,
  wardDistrict: true,
  city: true,
  state: true,
  postalCode: true,
  country: true,
  isDefault: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.AddressSelect;

export type SafeUserRecord = Prisma.UserGetPayload<{
  select: typeof USER_SELECT;
}>;

export type UserAddressRecord = Prisma.AddressGetPayload<{
  select: typeof ADDRESS_SELECT;
}>;

export interface FindAdminUsersInput {
  page: number;
  limit: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: USER_SELECT,
    });
  }

  findUserByPhone(phone: string) {
    return this.prisma.user.findUnique({
      where: { phone },
      select: USER_SELECT,
    });
  }

  updateUserById(
    id: string,
    data: Prisma.UserUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.user.update({
      where: { id },
      data,
      select: USER_SELECT,
    });
  }

  countAddressesByUserId(userId: string) {
    return this.prisma.address.count({ where: { userId } });
  }

  findAddressesByUserId(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      select: ADDRESS_SELECT,
    });
  }

  clearDefaultAddresses(userId: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.address.updateMany({
      where: {
        userId,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });
  }

  createAddress(
    data: Prisma.AddressUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.address.create({
      data,
      select: ADDRESS_SELECT,
    });
  }

  updateAddressById(
    id: string,
    data: Prisma.AddressUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.address.update({
      where: { id },
      data,
      select: ADDRESS_SELECT,
    });
  }

  findAddressByIdForUser(
    id: string,
    userId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.address.findFirst({
      where: {
        id,
        userId,
      },
      select: ADDRESS_SELECT,
    });
  }

  deleteAddressById(id: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prisma;

    return client.address.delete({
      where: { id },
      select: ADDRESS_SELECT,
    });
  }

  findLatestAddressForUser(
    userId: string,
    tx?: Prisma.TransactionClient,
    options?: { excludeAddressId?: string },
  ) {
    const client = tx ?? this.prisma;

    return client.address.findFirst({
      where: {
        userId,
        ...(options?.excludeAddressId
          ? {
              id: {
                not: options.excludeAddressId,
              },
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      select: ADDRESS_SELECT,
    });
  }

  setAddressDefault(
    id: string,
    isDefault: boolean,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    return client.address.update({
      where: { id },
      data: { isDefault },
      select: ADDRESS_SELECT,
    });
  }

  findAdminUsers(input: FindAdminUsersInput) {
    const where = this.buildUsersWhere(input);

    return this.prisma.user.findMany({
      where,
      skip: (input.page - 1) * input.limit,
      take: input.limit,
      orderBy: { createdAt: 'desc' },
      select: USER_SELECT,
    });
  }

  countAdminUsers(input: FindAdminUsersInput) {
    return this.prisma.user.count({
      where: this.buildUsersWhere(input),
    });
  }

  runInTransaction<T>(
    operation: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction((tx) => operation(tx));
  }

  private buildUsersWhere(input: FindAdminUsersInput): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {};

    if (input.role) {
      where.role = input.role;
    }

    if (input.status) {
      where.status = input.status;
    }

    if (input.search) {
      where.OR = [
        {
          email: {
            contains: input.search,
            mode: 'insensitive',
          },
        },
        {
          fullName: {
            contains: input.search,
            mode: 'insensitive',
          },
        },
        {
          phone: {
            contains: input.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    return where;
  }
}
