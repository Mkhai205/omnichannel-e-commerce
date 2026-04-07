import { Module } from '@nestjs/common';
import { FinanceModule } from '../finance/finance.module';
import { SellerShippingController } from './seller-shipping.controller';
import { ShippingCron } from './shipping.cron';
import { ShippingController } from './shipping.controller';
import { ShippingRepository } from './shipping.repository';
import { ShippingService } from './shipping.service';

@Module({
  imports: [FinanceModule],
  controllers: [ShippingController, SellerShippingController],
  providers: [ShippingRepository, ShippingService, ShippingCron],
  exports: [ShippingService],
})
export class ShippingModule {}
