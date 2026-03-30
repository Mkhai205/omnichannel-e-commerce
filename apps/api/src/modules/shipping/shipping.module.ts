import { Module } from '@nestjs/common';
import { ShippingCron } from './shipping.cron';
import { ShippingRepository } from './shipping.repository';
import { ShippingService } from './shipping.service';

@Module({
  providers: [ShippingRepository, ShippingService, ShippingCron],
  exports: [ShippingService],
})
export class ShippingModule {}
