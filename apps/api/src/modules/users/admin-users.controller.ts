import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type {
  AdminUserListResponse,
  ApiResponse,
  AuthUser,
} from '@repo/shared-types';
import { Roles } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import {
  ApiAuthSchemes,
  ApiCommonErrorResponses,
  ApiOkEnvelopeResponse,
} from '../../core/http/swagger-response.decorator';
import { AuthUserSwaggerDto } from '../auth/dto/auth-swagger.dto';
import { AdminUsersFilterDto } from './dto/admin-users-filter.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { AdminUserListDataSwaggerDto } from './dto/users-swagger.dto';
import { AdminUsersService } from './admin-users.service';

@ApiTags('Admin - Users')
@Roles('ADMIN')
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiOperation({ summary: 'List users with pagination and filters' })
  @ApiAuthSchemes()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: ['CUSTOMER', 'SELLER', 'ADMIN'],
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['ACTIVE', 'BANNED', 'UNVERIFIED'],
  })
  @ApiOkEnvelopeResponse(
    AdminUserListDataSwaggerDto,
    'Users list retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid query parameters',
    unauthorized: 'Authentication required',
    notFound: false,
  })
  async getUsers(
    @Query() filters: AdminUsersFilterDto,
  ): Promise<ApiResponse<AdminUserListResponse>> {
    const response = await this.adminUsersService.getAdminUsers(filters);

    return createSuccessResponse(response, {
      message: 'Users list retrieved successfully',
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one user details by id' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkEnvelopeResponse(
    AuthUserSwaggerDto,
    'User details retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid user id',
    unauthorized: 'Authentication required',
    notFound: 'User not found',
  })
  async getUserById(
    @Param('id', new ParseUUIDPipe()) userId: string,
  ): Promise<ApiResponse<AuthUser>> {
    const user = await this.adminUsersService.getAdminUserById(userId);

    return createSuccessResponse(user, {
      message: 'User details retrieved successfully',
    });
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update user account status' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateUserStatusDto })
  @ApiOkEnvelopeResponse(AuthUserSwaggerDto, 'User status updated successfully')
  @ApiCommonErrorResponses({
    badRequest: 'Invalid payload or user id',
    unauthorized: 'Authentication required',
    notFound: 'User not found',
  })
  async updateUserStatus(
    @Param('id', new ParseUUIDPipe()) userId: string,
    @Body() payload: UpdateUserStatusDto,
  ): Promise<ApiResponse<AuthUser>> {
    const user = await this.adminUsersService.updateAdminUserStatus(
      userId,
      payload,
    );

    return createSuccessResponse(user, {
      message: 'User status updated successfully',
    });
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Update user role' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateUserRoleDto })
  @ApiOkEnvelopeResponse(AuthUserSwaggerDto, 'User role updated successfully')
  @ApiCommonErrorResponses({
    badRequest: 'Invalid payload or user id',
    unauthorized: 'Authentication required',
    notFound: 'User not found',
  })
  async updateUserRole(
    @Param('id', new ParseUUIDPipe()) userId: string,
    @Body() payload: UpdateUserRoleDto,
  ): Promise<ApiResponse<AuthUser>> {
    const user = await this.adminUsersService.updateAdminUserRole(
      userId,
      payload,
    );

    return createSuccessResponse(user, {
      message: 'User role updated successfully',
    });
  }
}
