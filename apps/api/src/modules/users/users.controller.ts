import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import type {
  ApiResponse,
  AuthUser,
  UserAddress,
  UserAddressListResponse,
} from '@repo/shared-types';
import { CurrentUser } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import {
  ApiAuthSchemes,
  ApiCommonErrorResponses,
  ApiCreatedEnvelopeResponse,
  ApiOkEnvelopeResponse,
} from '../../core/http/swagger-response.decorator';
import { AuthUserSwaggerDto } from '../auth/dto/auth-swagger.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { CreateAddressDto } from './dto/create-address.dto';
import {
  OperationSuccessSwaggerDto,
  UserAddressListDataSwaggerDto,
  UserAddressSwaggerDto,
} from './dto/users-swagger.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UserProfileService } from './user-profile.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiAuthSchemes()
  @ApiOkEnvelopeResponse(AuthUserSwaggerDto, 'Profile retrieved successfully')
  @ApiCommonErrorResponses({
    badRequest: false,
    unauthorized: 'Authentication required',
    notFound: 'User not found',
  })
  async getMe(
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<ApiResponse<AuthUser>> {
    const user = await this.userProfileService.getMyProfile(currentUser.sub);

    return createSuccessResponse(user, {
      message: 'Profile retrieved successfully',
    });
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiAuthSchemes()
  @ApiBody({ type: UpdateProfileDto })
  @ApiOkEnvelopeResponse(AuthUserSwaggerDto, 'Profile updated successfully')
  @ApiCommonErrorResponses({
    badRequest: 'At least one valid field is required',
    unauthorized: 'Authentication required',
    notFound: 'User not found',
  })
  async updateMe(
    @CurrentUser() currentUser: JwtPayload,
    @Body() payload: UpdateProfileDto,
  ): Promise<ApiResponse<AuthUser>> {
    const user = await this.userProfileService.updateMyProfile(
      currentUser.sub,
      payload,
    );

    return createSuccessResponse(user, {
      message: 'Profile updated successfully',
    });
  }

  @Get('me/addresses')
  @ApiOperation({ summary: 'Get current user address book' })
  @ApiAuthSchemes()
  @ApiOkEnvelopeResponse(
    UserAddressListDataSwaggerDto,
    'Address book retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: false,
    unauthorized: 'Authentication required',
    notFound: 'User not found',
  })
  async getMyAddresses(
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<ApiResponse<UserAddressListResponse>> {
    const response = await this.userProfileService.getMyAddresses(
      currentUser.sub,
    );

    return createSuccessResponse(response, {
      message: 'Address book retrieved successfully',
    });
  }

  @Post('me/addresses')
  @ApiOperation({
    summary: 'Create a new address in current user address book',
  })
  @ApiAuthSchemes()
  @ApiBody({ type: CreateAddressDto })
  @ApiCreatedEnvelopeResponse(
    UserAddressSwaggerDto,
    'Address created successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid address payload',
    unauthorized: 'Authentication required',
    notFound: 'User not found',
  })
  async createMyAddress(
    @CurrentUser() currentUser: JwtPayload,
    @Body() payload: CreateAddressDto,
  ): Promise<ApiResponse<UserAddress>> {
    const address = await this.userProfileService.createMyAddress(
      currentUser.sub,
      payload,
    );

    return createSuccessResponse(address, {
      statusCode: HttpStatus.CREATED,
      message: 'Address created successfully',
    });
  }

  @Patch('me/addresses/:id')
  @ApiOperation({ summary: 'Update one address in current user address book' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateAddressDto })
  @ApiOkEnvelopeResponse(UserAddressSwaggerDto, 'Address updated successfully')
  @ApiCommonErrorResponses({
    badRequest: 'At least one valid field is required',
    unauthorized: 'Authentication required',
    notFound: 'Address not found',
  })
  async updateMyAddress(
    @CurrentUser() currentUser: JwtPayload,
    @Param('id', new ParseUUIDPipe()) addressId: string,
    @Body() payload: UpdateAddressDto,
  ): Promise<ApiResponse<UserAddress>> {
    const address = await this.userProfileService.updateMyAddress(
      currentUser.sub,
      addressId,
      payload,
    );

    return createSuccessResponse(address, {
      message: 'Address updated successfully',
    });
  }

  @Delete('me/addresses/:id')
  @ApiOperation({
    summary: 'Delete one address from current user address book',
  })
  @ApiAuthSchemes()
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkEnvelopeResponse(
    OperationSuccessSwaggerDto,
    'Address deleted successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid address id',
    unauthorized: 'Authentication required',
    notFound: 'Address not found',
  })
  async deleteMyAddress(
    @CurrentUser() currentUser: JwtPayload,
    @Param('id', new ParseUUIDPipe()) addressId: string,
  ): Promise<ApiResponse<{ success: boolean }>> {
    const result = await this.userProfileService.deleteMyAddress(
      currentUser.sub,
      addressId,
    );

    return createSuccessResponse(result, {
      message: 'Address deleted successfully',
    });
  }
}
