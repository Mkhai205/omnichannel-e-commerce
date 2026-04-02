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
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type {
  ApiResponse,
  InventoryLogItem,
  InventoryLogsListResponse,
} from '@repo/shared-types';
import { CurrentUser, Roles } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import {
  ApiAuthSchemes,
  ApiCommonErrorResponses,
  ApiCreatedEnvelopeResponse,
  ApiOkEnvelopeResponse,
} from '../../core/http/swagger-response.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { CreateInventoryLogDto } from './dto/create-inventory-log.dto';
import { InventoryLogsFilterDto } from './dto/inventory-logs-filter.dto';
import {
  InventoryLogSwaggerDto,
  InventoryLogsListDataSwaggerDto,
} from './dto/inventory-swagger.dto';
import { SellerInventoryService } from './seller-inventory.service';

@ApiTags('Seller - Inventory')
@Roles('SELLER')
@Controller('seller/catalog')
export class SellerInventoryController {
  constructor(
    private readonly sellerInventoryService: SellerInventoryService,
  ) {}

  @Post('variants/:variantId/inventory-logs')
  @ApiOperation({
    summary: 'Create inventory log and adjust stock for a variant',
  })
  @ApiAuthSchemes()
  @ApiParam({ name: 'variantId', format: 'uuid' })
  @ApiBody({ type: CreateInventoryLogDto })
  @ApiCreatedEnvelopeResponse(
    InventoryLogSwaggerDto,
    'Inventory log created successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid payload or stock adjustment',
    unauthorized: 'Authentication required',
    notFound: 'Variant not found',
  })
  async createInventoryLog(
    @CurrentUser() currentUser: JwtPayload,
    @Param('variantId', new ParseUUIDPipe()) variantId: string,
    @Body() payload: CreateInventoryLogDto,
  ): Promise<ApiResponse<InventoryLogItem>> {
    const log = await this.sellerInventoryService.createMyInventoryLog(
      currentUser.sub,
      variantId,
      payload,
    );

    return createSuccessResponse(log, {
      statusCode: 201,
      message: 'Inventory log created successfully',
    });
  }

  @Get('variants/:variantId/inventory-logs')
  @ApiOperation({ summary: 'Get inventory logs for one seller variant' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'variantId', format: 'uuid' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'warehouseId', required: false, type: String })
  @ApiOkEnvelopeResponse(
    InventoryLogsListDataSwaggerDto,
    'Inventory logs retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid query parameters or variant id',
    unauthorized: 'Authentication required',
    notFound: 'Variant not found',
  })
  async getInventoryLogs(
    @CurrentUser() currentUser: JwtPayload,
    @Param('variantId', new ParseUUIDPipe()) variantId: string,
    @Query() filters: InventoryLogsFilterDto,
  ): Promise<ApiResponse<InventoryLogsListResponse>> {
    const response =
      await this.sellerInventoryService.getMyVariantInventoryLogs(
        currentUser.sub,
        variantId,
        filters,
      );

    return createSuccessResponse(response, {
      message: 'Inventory logs retrieved successfully',
    });
  }
}
