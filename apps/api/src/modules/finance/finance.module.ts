import { Module } from '@nestjs/common';
import { AdminFinanceController } from './admin-finance.controller';
import { FinanceRepository } from './finance.repository';
import { FinanceService } from './finance.service';
import { SellerPaymentsController } from './seller-payments.controller';

@Module({
  controllers: [SellerPaymentsController, AdminFinanceController],
  providers: [FinanceRepository, FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}
