import { Module } from '@nestjs/common';
import { FinanceRepository } from './finance.repository';
import { FinanceService } from './finance.service';
import { SellerPaymentsController } from './seller-payments.controller';

@Module({
  controllers: [SellerPaymentsController],
  providers: [FinanceRepository, FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}
