import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  AddressType,
  AuthUser,
  CreateAddressRequest,
  UpdateProfileRequest,
  UserAddress,
  UserAddressListResponse,
} from '@repo/shared-types';
import type { SafeUserRecord, UserAddressRecord } from './users.repository';
import { UsersRepository } from './users.repository';

@Injectable()
export class UserProfileService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getMyProfile(userId: string): Promise<AuthUser> {
    const user = await this.usersRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toAuthUser(user);
  }

  async updateMyProfile(
    userId: string,
    payload: UpdateProfileRequest,
  ): Promise<AuthUser> {
    const fullName = payload.fullName?.trim();
    const phone = payload.phone?.trim();

    if (!fullName && !phone) {
      throw new BadRequestException('At least one field must be provided');
    }

    const existingUser = await this.usersRepository.findUserById(userId);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (phone) {
      const conflictUser = await this.usersRepository.findUserByPhone(phone);

      if (conflictUser && conflictUser.id !== userId) {
        throw new ConflictException('Phone number is already in use');
      }
    }

    const updatedUser = await this.usersRepository.updateUserById(userId, {
      ...(fullName ? { fullName } : {}),
      ...(phone ? { phone } : {}),
    });

    return this.toAuthUser(updatedUser);
  }

  async getMyAddresses(userId: string): Promise<UserAddressListResponse> {
    const user = await this.usersRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const addresses = await this.usersRepository.findAddressesByUserId(userId);

    return {
      addresses: addresses.map((address) => this.toUserAddress(address)),
    };
  }

  async createMyAddress(
    userId: string,
    payload: CreateAddressRequest,
  ): Promise<UserAddress> {
    const user = await this.usersRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const addressCount =
      await this.usersRepository.countAddressesByUserId(userId);
    const shouldSetDefault = payload.isDefault === true || addressCount === 0;

    const createdAddress = await this.usersRepository.runInTransaction(
      async (tx) => {
        if (shouldSetDefault) {
          await this.usersRepository.clearDefaultAddresses(userId, tx);
        }

        return this.usersRepository.createAddress(
          {
            userId,
            type: payload.type,
            recipientName: payload.recipientName.trim(),
            recipientPhone: payload.recipientPhone.trim(),
            streetAddress: payload.streetAddress.trim(),
            wardDistrict: payload.wardDistrict?.trim() || null,
            city: payload.city.trim(),
            state: payload.state.trim(),
            postalCode: payload.postalCode.trim(),
            country: payload.country.trim(),
            isDefault: shouldSetDefault,
          },
          tx,
        );
      },
    );

    return this.toUserAddress(createdAddress);
  }

  async deleteMyAddress(
    userId: string,
    addressId: string,
  ): Promise<{ success: boolean }> {
    await this.usersRepository.runInTransaction(async (tx) => {
      const address = await this.usersRepository.findAddressByIdForUser(
        addressId,
        userId,
        tx,
      );

      if (!address) {
        throw new NotFoundException('Address not found');
      }

      await this.usersRepository.deleteAddressById(addressId, tx);

      if (address.isDefault) {
        const replacementAddress =
          await this.usersRepository.findLatestAddressForUser(userId, tx);

        if (replacementAddress) {
          await this.usersRepository.setAddressDefault(
            replacementAddress.id,
            true,
            tx,
          );
        }
      }
    });

    return { success: true };
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

  private toUserAddress(address: UserAddressRecord): UserAddress {
    return {
      id: address.id,
      userId: address.userId,
      type: address.type as AddressType,
      recipientName: address.recipientName,
      recipientPhone: address.recipientPhone,
      streetAddress: address.streetAddress,
      wardDistrict: address.wardDistrict,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
      createdAt: address.createdAt.toISOString(),
      updatedAt: address.updatedAt.toISOString(),
    };
  }
}
