import { Module } from '@nestjs/common';
import { FinanceModule } from '../finance/finance.module';
import { ShippingCron } from './shipping.cron';
import { ShippingController } from './shipping.controller';
import { ShippingRepository } from './shipping.repository';
import { ShippingService } from './shipping.service';

@Module({
  imports: [FinanceModule],
  controllers: [ShippingController],
  providers: [ShippingRepository, ShippingService, ShippingCron],
  exports: [ShippingService],
})
export class ShippingModule {}
