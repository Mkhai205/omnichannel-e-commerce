import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import type {
  ApiResponse,
  SellerOrderDetailResponse,
  SellerOrderItem,
  SellerOrdersListResponse,
} from '@repo/shared-types';
import { CurrentUser, Roles } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import {
  ApiAuthSchemes,
  ApiCommonErrorResponses,
  ApiOkEnvelopeResponse,
} from '../../core/http/swagger-response.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import {
  SellerOrderDetailSwaggerDto,
  SellerOrderSwaggerDto,
  SellerOrdersListDataSwaggerDto,
} from './dto/orders-swagger.dto';
import { SellerOrdersFilterDto } from './dto/seller-orders-filter.dto';
import { OrdersService } from './orders.service';

@ApiTags('Seller - Orders')
@Roles('SELLER')
@Controller('seller/orders')
export class SellerOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get current seller orders list' })
  @ApiAuthSchemes()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
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
  @ApiOkEnvelopeResponse(
    SellerOrdersListDataSwaggerDto,
    'Seller orders list retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid query parameters',
    unauthorized: 'Authentication required',
  })
  async getMyOrders(
    @CurrentUser() currentUser: JwtPayload,
    @Query() filters: SellerOrdersFilterDto,
  ): Promise<ApiResponse<SellerOrdersListResponse>> {
    const response = await this.ordersService.getMyOrders(
      currentUser.sub,
      filters,
    );

    return createSuccessResponse(response, {
      message: 'Seller orders list retrieved successfully',
    });
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get seller order detail by id' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'orderId', format: 'uuid' })
  @ApiOkEnvelopeResponse(
    SellerOrderDetailSwaggerDto,
    'Seller order detail retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid order id',
    unauthorized: 'Authentication required',
    notFound: 'Order not found',
  })
  async getMyOrderDetail(
    @CurrentUser() currentUser: JwtPayload,
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ): Promise<ApiResponse<SellerOrderDetailResponse>> {
    const response = await this.ordersService.getMyOrderDetail(
      currentUser.sub,
      orderId,
    );

    return createSuccessResponse(response, {
      message: 'Seller order detail retrieved successfully',
    });
  }

  @Patch(':orderId/processing')
  @ApiOperation({ summary: 'Move one seller order from PAID to PROCESSING' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'orderId', format: 'uuid' })
  @ApiOkEnvelopeResponse(
    SellerOrderSwaggerDto,
    'Order moved to processing successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Order status is invalid for processing',
    unauthorized: 'Authentication required',
    notFound: 'Order not found',
  })
  async markOrderAsProcessing(
    @CurrentUser() currentUser: JwtPayload,
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ): Promise<ApiResponse<SellerOrderItem>> {
    const order = await this.ordersService.markMyOrderAsProcessing(
      currentUser.sub,
      orderId,
    );

    return createSuccessResponse(order, {
      message: 'Order moved to processing successfully',
    });
  }

  @Patch(':orderId/ship')
  @ApiOperation({ summary: 'Move one seller order from PROCESSING to SHIPPED' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'orderId', format: 'uuid' })
  @ApiOkEnvelopeResponse(SellerOrderSwaggerDto, 'Order shipped successfully')
  @ApiCommonErrorResponses({
    badRequest: 'Order status is invalid for shipping',
    unauthorized: 'Authentication required',
    notFound: 'Order not found',
  })
  async markOrderAsShipped(
    @CurrentUser() currentUser: JwtPayload,
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ): Promise<ApiResponse<SellerOrderItem>> {
    const order = await this.ordersService.markMyOrderAsShipped(
      currentUser.sub,
      orderId,
    );

    return createSuccessResponse(order, {
      message: 'Order shipped successfully',
    });
  }
}
