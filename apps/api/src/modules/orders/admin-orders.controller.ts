import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import type {
  AdminOrderDetailResponse,
  AdminOrdersListResponse,
  ApiResponse,
} from '@repo/shared-types';
import { Roles } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import {
  ApiAuthSchemes,
  ApiCommonErrorResponses,
  ApiOkEnvelopeResponse,
} from '../../core/http/swagger-response.decorator';
import { AdminOrdersFilterDto } from './dto/admin-orders-filter.dto';
import {
  AdminOrdersListDataSwaggerDto,
  SellerOrderDetailSwaggerDto,
} from './dto/orders-swagger.dto';
import { OrdersService } from './orders.service';

@ApiTags('Admin - Orders')
@Roles('ADMIN')
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders with admin filters' })
  @ApiAuthSchemes()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'placedFrom', required: false, type: String })
  @ApiQuery({ name: 'placedTo', required: false, type: String })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: [
      'PENDING_PAYMENT',
      'PAID',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
    ],
  })
  @ApiQuery({
    name: 'settlementStatus',
    required: false,
    enum: ['PENDING', 'SETTLED'],
  })
  @ApiOkEnvelopeResponse(
    AdminOrdersListDataSwaggerDto,
    'Admin orders list retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid query parameters',
    unauthorized: 'Authentication required',
    notFound: false,
  })
  async getAdminOrders(
    @Query() filters: AdminOrdersFilterDto,
  ): Promise<ApiResponse<AdminOrdersListResponse>> {
    const response = await this.ordersService.getAdminOrders(filters);

    return createSuccessResponse(response, {
      message: 'Admin orders list retrieved successfully',
    });
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get admin order detail by id' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'orderId', format: 'uuid' })
  @ApiOkEnvelopeResponse(
    SellerOrderDetailSwaggerDto,
    'Admin order detail retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid order id',
    unauthorized: 'Authentication required',
    notFound: 'Order not found',
  })
  async getAdminOrderDetail(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ): Promise<ApiResponse<AdminOrderDetailResponse>> {
    const response = await this.ordersService.getAdminOrderDetail(orderId);

    return createSuccessResponse(response, {
      message: 'Admin order detail retrieved successfully',
    });
  }
}
