import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import type {
  ApiResponse,
  InventoryLogItem,
  SellerInventoryListResponse,
  SellerInventoryOverview,
  SellerWarehouseItem,
} from '@repo/shared-types';
import { CurrentUser, Roles } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import {
  ApiAuthSchemes,
  ApiCommonErrorResponses,
  ApiCreatedEnvelopeResponse,
  ApiOkEnvelopeResponse,
} from '../../core/http/swagger-response.decorator';
import { ApiSuccessResponseSwaggerDto } from '../../core/http/swagger-response.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { CreateSellerInventoryAdjustmentDto } from './dto/create-seller-inventory-adjustment.dto';
import {
  SellerInventoryFilterDto,
  SellerInventoryOverviewFilterDto,
} from './dto/seller-inventory-filter.dto';
import {
  InventoryLogSwaggerDto,
  SellerInventoryListDataSwaggerDto,
  SellerInventoryOverviewSwaggerDto,
  SellerWarehouseSwaggerDto,
} from './dto/inventory-swagger.dto';
import { SellerInventoryService } from './seller-inventory.service';

@ApiTags('Seller - Inventory Dashboard')
@Roles('SELLER')
@Controller('seller/inventory')
export class SellerInventoryDashboardController {
  constructor(
    private readonly sellerInventoryService: SellerInventoryService,
  ) {}

  @Get('warehouses')
  @ApiOperation({ summary: 'Get seller warehouses' })
  @ApiAuthSchemes()
  @ApiExtraModels(ApiSuccessResponseSwaggerDto, SellerWarehouseSwaggerDto)
  @ApiOkResponse({
    description: 'Seller warehouses retrieved successfully',
    schema: {
      allOf: [
        {
          $ref: getSchemaPath(ApiSuccessResponseSwaggerDto),
        },
        {
          properties: {
            statusCode: {
              type: 'number',
              example: 200,
            },
            data: {
              type: 'array',
              items: {
                $ref: getSchemaPath(SellerWarehouseSwaggerDto),
              },
            },
          },
        },
      ],
    },
  })
  @ApiCommonErrorResponses({
    unauthorized: 'Authentication required',
    notFound: 'Seller shop not found',
  })
  async getMyWarehouses(
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<ApiResponse<SellerWarehouseItem[]>> {
    const warehouses = await this.sellerInventoryService.getMyWarehouses(
      currentUser.sub,
    );

    return createSuccessResponse(warehouses, {
      message: 'Seller warehouses retrieved successfully',
    });
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get seller inventory overview metrics' })
  @ApiAuthSchemes()
  @ApiQuery({ name: 'warehouseId', required: false, type: String })
  @ApiOkEnvelopeResponse(
    SellerInventoryOverviewSwaggerDto,
    'Seller inventory overview retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid query parameters',
    unauthorized: 'Authentication required',
    notFound: 'Seller shop or warehouse not found',
  })
  async getMyInventoryOverview(
    @CurrentUser() currentUser: JwtPayload,
    @Query() filters: SellerInventoryOverviewFilterDto,
  ): Promise<ApiResponse<SellerInventoryOverview>> {
    const overview = await this.sellerInventoryService.getMyInventoryOverview(
      currentUser.sub,
      filters,
    );

    return createSuccessResponse(overview, {
      message: 'Seller inventory overview retrieved successfully',
    });
  }

  @Get('items')
  @ApiOperation({ summary: 'Get seller inventory items list' })
  @ApiAuthSchemes()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'warehouseId', required: false, type: String })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'],
  })
  @ApiOkEnvelopeResponse(
    SellerInventoryListDataSwaggerDto,
    'Seller inventory list retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid query parameters',
    unauthorized: 'Authentication required',
    notFound: 'Seller shop or warehouse not found',
  })
  async getMyInventoryItems(
    @CurrentUser() currentUser: JwtPayload,
    @Query() filters: SellerInventoryFilterDto,
  ): Promise<ApiResponse<SellerInventoryListResponse>> {
    const response = await this.sellerInventoryService.getMyInventory(
      currentUser.sub,
      filters,
    );

    return createSuccessResponse(response, {
      message: 'Seller inventory list retrieved successfully',
    });
  }

  @Post('variants/:variantId/adjustments')
  @ApiOperation({
    summary: 'Create inventory adjustment for a seller variant and warehouse',
  })
  @ApiAuthSchemes()
  @ApiParam({ name: 'variantId', format: 'uuid' })
  @ApiBody({ type: CreateSellerInventoryAdjustmentDto })
  @ApiCreatedEnvelopeResponse(
    InventoryLogSwaggerDto,
    'Inventory adjustment created successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid payload or stock adjustment',
    unauthorized: 'Authentication required',
    notFound: 'Variant, warehouse, or seller shop not found',
  })
  async createInventoryAdjustment(
    @CurrentUser() currentUser: JwtPayload,
    @Param('variantId', new ParseUUIDPipe()) variantId: string,
    @Body() payload: CreateSellerInventoryAdjustmentDto,
  ): Promise<ApiResponse<InventoryLogItem>> {
    const log = await this.sellerInventoryService.createMyInventoryAdjustment(
      currentUser.sub,
      variantId,
      payload,
    );

    return createSuccessResponse(log, {
      statusCode: 201,
      message: 'Inventory adjustment created successfully',
    });
  }
}
