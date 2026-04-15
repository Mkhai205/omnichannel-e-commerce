import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import type {
  ApiResponse,
  ConnectSellerChannelResponse,
  DisconnectSellerChannelResponse,
  SalesChannelType,
  SellerChannelConnectionItem,
  SellerChannelSyncRunsResponse,
  TriggerChannelSyncResponse,
} from '@repo/shared-types';
import { CurrentUser, Roles } from '../../core/decorators';
import { createSuccessResponse } from '../../core/http/api-response.util';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { ChannelSyncService } from './channel-sync.service';
import { ConnectSellerChannelDto } from './dto/connect-seller-channel.dto';
import { SellerChannelSyncRunsFilterDto } from './dto/seller-channel-sync-runs-filter.dto';
import { TriggerChannelSyncDto } from './dto/trigger-channel-sync.dto';

const SALES_CHANNEL_TYPES: SalesChannelType[] = [
  'WEB',
  'TIKTOK_MOCK',
  'SHOPEE_MOCK',
];

@ApiTags('Seller - Channels')
@Roles('SELLER')
@Controller('seller/channels')
export class SellerChannelController {
  constructor(private readonly channelSyncService: ChannelSyncService) {}

  @Get()
  @ApiOperation({ summary: 'Get seller channel connection list' })
  async getMyChannels(
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<ApiResponse<SellerChannelConnectionItem[]>> {
    const response = await this.channelSyncService.getMyChannelConnections(
      currentUser.sub,
    );

    return createSuccessResponse(response, {
      message: 'Seller channel list retrieved successfully',
    });
  }

  @Post(':channelType/connect')
  @ApiOperation({ summary: 'Connect one seller channel (mock)' })
  @ApiParam({ name: 'channelType', enum: SALES_CHANNEL_TYPES })
  async connectMyChannel(
    @CurrentUser() currentUser: JwtPayload,
    @Param('channelType') channelTypeInput: string,
    @Body() body: ConnectSellerChannelDto,
  ): Promise<ApiResponse<ConnectSellerChannelResponse>> {
    const response = await this.channelSyncService.connectMyChannel(
      currentUser.sub,
      this.toChannelType(channelTypeInput),
      body,
    );

    return createSuccessResponse(response, {
      message: 'Seller channel connected successfully',
    });
  }

  @Post(':channelType/disconnect')
  @ApiOperation({ summary: 'Disconnect one seller channel (mock)' })
  @ApiParam({ name: 'channelType', enum: SALES_CHANNEL_TYPES })
  async disconnectMyChannel(
    @CurrentUser() currentUser: JwtPayload,
    @Param('channelType') channelTypeInput: string,
  ): Promise<ApiResponse<DisconnectSellerChannelResponse>> {
    const response = await this.channelSyncService.disconnectMyChannel(
      currentUser.sub,
      this.toChannelType(channelTypeInput),
    );

    return createSuccessResponse(response, {
      message: 'Seller channel disconnected successfully',
    });
  }

  @Post(':channelType/sync')
  @ApiOperation({ summary: 'Trigger channel sync run manually' })
  @ApiParam({ name: 'channelType', enum: SALES_CHANNEL_TYPES })
  async triggerMyChannelSync(
    @CurrentUser() currentUser: JwtPayload,
    @Param('channelType') channelTypeInput: string,
    @Body() body: TriggerChannelSyncDto,
  ): Promise<ApiResponse<TriggerChannelSyncResponse>> {
    const response = await this.channelSyncService.triggerMyChannelSync(
      currentUser.sub,
      this.toChannelType(channelTypeInput),
      body,
    );

    return createSuccessResponse(response, {
      message: 'Channel sync run created successfully',
    });
  }

  @Get('sync-runs')
  @ApiOperation({ summary: 'Get seller channel sync run history' })
  async getMyChannelSyncRuns(
    @CurrentUser() currentUser: JwtPayload,
    @Query() filters: SellerChannelSyncRunsFilterDto,
  ): Promise<ApiResponse<SellerChannelSyncRunsResponse>> {
    const response = await this.channelSyncService.getMyChannelSyncRuns(
      currentUser.sub,
      filters,
    );

    return createSuccessResponse(response, {
      message: 'Seller channel sync history retrieved successfully',
    });
  }

  private toChannelType(input: string): SalesChannelType {
    const normalized = input.trim().toUpperCase() as SalesChannelType;

    if (!SALES_CHANNEL_TYPES.includes(normalized)) {
      throw new BadRequestException('Unsupported channel type');
    }

    return normalized;
  }
}
