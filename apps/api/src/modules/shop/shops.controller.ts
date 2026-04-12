import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import type {
  ApiResponse,
  PublicShopDetailItem,
  PublicShopsListResponse,
} from '@repo/shared-types';
import { Public } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import {
  ApiCommonErrorResponses,
  ApiOkEnvelopeResponse,
} from '../../core/http/swagger-response.decorator';
import { PublicShopsFilterDto } from './dto/public-shops-filter.dto';
import {
  PublicShopDetailSwaggerDto,
  PublicShopsListDataSwaggerDto,
} from './dto/shops-swagger.dto';
import { PublicShopsService } from './public-shops.service';

@ApiTags('Shops')
@Controller('shops')
export class ShopsController {
  constructor(private readonly publicShopsService: PublicShopsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get public shops list' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiOkEnvelopeResponse(
    PublicShopsListDataSwaggerDto,
    'Public shops list retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid query parameters',
    unauthorized: false,
    notFound: false,
  })
  async getShops(
    @Query() filters: PublicShopsFilterDto,
  ): Promise<ApiResponse<PublicShopsListResponse>> {
    const response = await this.publicShopsService.getPublicShops(filters);

    return createSuccessResponse(response, {
      message: 'Public shops list retrieved successfully',
    });
  }

  @Public()
  @Get('by-id/:id')
  @ApiOperation({ summary: 'Get public shop details by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkEnvelopeResponse(
    PublicShopDetailSwaggerDto,
    'Public shop details retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid shop id',
    unauthorized: false,
    notFound: 'Shop not found',
  })
  async getShopById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ApiResponse<PublicShopDetailItem>> {
    const shop = await this.publicShopsService.getPublicShopById(id);

    return createSuccessResponse(shop, {
      message: 'Public shop details retrieved successfully',
    });
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get public shop details by slug' })
  @ApiParam({ name: 'slug', type: String })
  @ApiOkEnvelopeResponse(
    PublicShopDetailSwaggerDto,
    'Public shop details retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: false,
    unauthorized: false,
    notFound: 'Shop not found',
  })
  async getShopBySlug(
    @Param('slug') slug: string,
  ): Promise<ApiResponse<PublicShopDetailItem>> {
    const shop = await this.publicShopsService.getPublicShopBySlug(slug);

    return createSuccessResponse(shop, {
      message: 'Public shop details retrieved successfully',
    });
  }
}
