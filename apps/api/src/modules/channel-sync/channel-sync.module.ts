import { Module } from '@nestjs/common';
import { ChannelSyncRepository } from './channel-sync.repository';
import { ChannelSyncService } from './channel-sync.service';
import { SellerChannelController } from './seller-channel.controller';

@Module({
  controllers: [SellerChannelController],
  providers: [ChannelSyncRepository, ChannelSyncService],
  exports: [ChannelSyncService],
})
export class ChannelSyncModule {}
