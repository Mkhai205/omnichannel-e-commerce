import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
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
  CheckoutOrdersResponse,
  CustomerOrderDetailResponse,
  CustomerOrderListResponse,
} from '@repo/shared-types';
import type { Request } from 'express';
import { CurrentUser, Roles } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import {
  ApiAuthSchemes,
  ApiCommonErrorResponses,
  ApiOkEnvelopeResponse,
} from '../../core/http/swagger-response.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { CustomerOrdersFilterDto } from './dto/customer-orders-filter.dto';
import { CheckoutOrdersDto } from './dto/checkout-orders.dto';
import {
  CheckoutOrdersResponseSwaggerDto,
  CustomerOrderDetailSwaggerDto,
  CustomerOrdersListDataSwaggerDto,
} from './dto/orders-swagger.dto';
import { OrdersService } from './orders.service';

@ApiTags('Customer - Orders')
@Roles('CUSTOMER')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get current customer order history list' })
  @ApiAuthSchemes()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
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
    CustomerOrdersListDataSwaggerDto,
    'Customer orders list retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid query parameters',
    unauthorized: 'Authentication required',
  })
  async getMyOrders(
    @CurrentUser() currentUser: JwtPayload,
    @Query() filters: CustomerOrdersFilterDto,
  ): Promise<ApiResponse<CustomerOrderListResponse>> {
    const response = await this.ordersService.getMyCustomerOrders(
      currentUser.sub,
      filters,
    );

    return createSuccessResponse(response, {
      message: 'Customer orders list retrieved successfully',
    });
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get customer order detail by id' })
  @ApiAuthSchemes()
  @ApiParam({ name: 'orderId', format: 'uuid' })
  @ApiOkEnvelopeResponse(
    CustomerOrderDetailSwaggerDto,
    'Customer order detail retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid order id',
    unauthorized: 'Authentication required',
    notFound: 'Order not found',
  })
  async getMyOrderDetail(
    @CurrentUser() currentUser: JwtPayload,
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ): Promise<ApiResponse<CustomerOrderDetailResponse>> {
    const response = await this.ordersService.getMyCustomerOrderDetail(
      currentUser.sub,
      orderId,
    );

    return createSuccessResponse(response, {
      message: 'Customer order detail retrieved successfully',
    });
  }

  @Post('checkout')
  @ApiOperation({
    summary: 'Checkout selected cart items and split orders by shop',
  })
  @ApiAuthSchemes()
  @ApiBody({ type: CheckoutOrdersDto })
  @ApiOkEnvelopeResponse(
    CheckoutOrdersResponseSwaggerDto,
    'Checkout completed successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid payload or insufficient stock',
    unauthorized: 'Authentication required',
    notFound: 'Shipping address or cart item not found',
  })
  async checkout(
    @CurrentUser() currentUser: JwtPayload,
    @Body() payload: CheckoutOrdersDto,
    @Req() request: Request,
  ): Promise<ApiResponse<CheckoutOrdersResponse>> {
    const response = await this.ordersService.checkout(
      currentUser.sub,
      payload,
      this.extractRequestIp(request),
    );

    return createSuccessResponse(response, {
      message: 'Checkout completed successfully',
    });
  }

  private extractRequestIp(request: Request): string {
    const fallbackIp = request.ip ?? '127.0.0.1';
    const forwardedFor = request.headers['x-forwarded-for'];

    if (typeof forwardedFor === 'string') {
      return forwardedFor.split(',')[0]?.trim() || fallbackIp;
    }

    if (Array.isArray(forwardedFor)) {
      const firstIp = forwardedFor[0]?.split(',')[0]?.trim();
      if (firstIp) {
        return firstIp;
      }
    }

    return fallbackIp;
  }
}
