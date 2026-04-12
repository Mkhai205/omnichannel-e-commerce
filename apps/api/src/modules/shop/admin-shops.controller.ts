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
  AdminShopsListResponse,
  ApiResponse,
  ShopDetail,
} from '@repo/shared-types';
import { CurrentUser, Roles } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import {
  ApiAuthSchemes,
  ApiCommonErrorResponses,
  ApiOkEnvelopeResponse,
} from '../../core/http/swagger-response.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { AdminShopsService } from './admin-shops.service';
import { AdminShopsFilterDto } from './dto/admin-shops-filter.dto';
import { AdminUpdateShopStatusDto } from './dto/admin-update-shop-status.dto';
import {
  AdminShopsListDataSwaggerDto,
  ShopDetailSwaggerDto,
} from './dto/shops-swagger.dto';

@ApiTags('Admin - Shops')
@Roles('ADMIN')
@Controller('admin/shops')
export class AdminShopsController {
  constructor(private readonly adminShopsService: AdminShopsService) {}

  @Get()
  @ApiOperation({ summary: 'List shops with pagination and filters' })
  @ApiAuthSchemes()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
  })
  @ApiOkEnvelopeResponse(
    AdminShopsListDataSwaggerDto,
    'Admin shops list retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid query parameters',
    unauthorized: 'Authentication required',
    notFound: false,
  })
  async getShops(
    @Query() filters: AdminShopsFilterDto,
  ): Promise<ApiResponse<AdminShopsListResponse>> {
    const response = await this.adminShopsService.getAdminShops(filters);

    return createSuccessResponse(response, {
      message: 'Admin shops list retrieved successfully',
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one shop details by id' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkEnvelopeResponse(
    ShopDetailSwaggerDto,
    'Admin shop details retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid shop id',
    unauthorized: 'Authentication required',
    notFound: 'Shop not found',
  })
  async getShopById(
    @Param('id', new ParseUUIDPipe()) shopId: string,
  ): Promise<ApiResponse<ShopDetail>> {
    const shop = await this.adminShopsService.getAdminShopById(shopId);

    return createSuccessResponse(shop, {
      message: 'Admin shop details retrieved successfully',
    });
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update shop status' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: AdminUpdateShopStatusDto })
  @ApiOkEnvelopeResponse(
    ShopDetailSwaggerDto,
    'Shop status updated successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid payload or shop id',
    unauthorized: 'Authentication required',
    notFound: 'Shop not found',
  })
  async updateShopStatus(
    @CurrentUser() currentUser: JwtPayload,
    @Param('id', new ParseUUIDPipe()) shopId: string,
    @Body() payload: AdminUpdateShopStatusDto,
  ): Promise<ApiResponse<ShopDetail>> {
    const shop = await this.adminShopsService.updateAdminShopStatus(
      currentUser.sub,
      shopId,
      payload,
    );

    return createSuccessResponse(shop, {
      message: 'Shop status updated successfully',
    });
  }
}
