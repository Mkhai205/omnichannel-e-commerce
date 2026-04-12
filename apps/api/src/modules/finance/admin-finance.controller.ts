import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import type {
  AdminDashboardKpiResponse,
  AdminPaymentsListResponse,
  AdminSettlementsListResponse,
  ApiResponse,
} from '@repo/shared-types';
import { Roles } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import {
  ApiAuthSchemes,
  ApiCommonErrorResponses,
  ApiOkEnvelopeResponse,
} from '../../core/http/swagger-response.decorator';
import {
  AdminPaymentsFilterDto,
  AdminSettlementsFilterDto,
} from './dto/admin-finance-filter.dto';
import {
  AdminDashboardKpiSwaggerDto,
  AdminPaymentsListSwaggerDto,
  AdminSettlementsListSwaggerDto,
} from './dto/admin-finance-swagger.dto';
import { FinanceService } from './finance.service';

@ApiTags('Admin - Finance')
@Roles('ADMIN')
@Controller('admin')
export class AdminFinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('payments')
  @ApiOperation({ summary: 'Get admin payments list with filters' })
  @ApiAuthSchemes()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'],
  })
  @ApiQuery({ name: 'provider', required: false, enum: ['VNPAY'] })
  @ApiQuery({ name: 'createdFrom', required: false, type: String })
  @ApiQuery({ name: 'createdTo', required: false, type: String })
  @ApiOkEnvelopeResponse(
    AdminPaymentsListSwaggerDto,
    'Admin payments list retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid query parameters',
    unauthorized: 'Authentication required',
    notFound: false,
  })
  async getAdminPayments(
    @Query() filters: AdminPaymentsFilterDto,
  ): Promise<ApiResponse<AdminPaymentsListResponse>> {
    const response = await this.financeService.getAdminPayments(filters);

    return createSuccessResponse(response, {
      message: 'Admin payments list retrieved successfully',
    });
  }

  @Get('settlements')
  @ApiOperation({ summary: 'Get admin settlements list with filters' })
  @ApiAuthSchemes()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['COMPLETED', 'REVERSED'],
  })
  @ApiQuery({ name: 'settledFrom', required: false, type: String })
  @ApiQuery({ name: 'settledTo', required: false, type: String })
  @ApiOkEnvelopeResponse(
    AdminSettlementsListSwaggerDto,
    'Admin settlements list retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: 'Invalid query parameters',
    unauthorized: 'Authentication required',
    notFound: false,
  })
  async getAdminSettlements(
    @Query() filters: AdminSettlementsFilterDto,
  ): Promise<ApiResponse<AdminSettlementsListResponse>> {
    const response = await this.financeService.getAdminSettlements(filters);

    return createSuccessResponse(response, {
      message: 'Admin settlements list retrieved successfully',
    });
  }

  @Get('dashboard/kpi')
  @ApiOperation({ summary: 'Get admin dashboard KPI summary' })
  @ApiAuthSchemes()
  @ApiOkEnvelopeResponse(
    AdminDashboardKpiSwaggerDto,
    'Admin dashboard KPI retrieved successfully',
  )
  @ApiCommonErrorResponses({
    badRequest: false,
    unauthorized: 'Authentication required',
    notFound: false,
  })
  async getAdminDashboardKpi(): Promise<
    ApiResponse<AdminDashboardKpiResponse>
  > {
    const response = await this.financeService.getAdminDashboardKpi();

    return createSuccessResponse(response, {
      message: 'Admin dashboard KPI retrieved successfully',
    });
  }
}
