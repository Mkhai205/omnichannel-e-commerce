import { Module } from '@nestjs/common';
import { ShippingCron } from './shipping.cron';
import { ShippingController } from './shipping.controller';
import { ShippingRepository } from './shipping.repository';
import { ShippingService } from './shipping.service';

@Module({
  controllers: [ShippingController],
  providers: [ShippingRepository, ShippingService, ShippingCron],
  exports: [ShippingService],
})
export class ShippingModule {}
