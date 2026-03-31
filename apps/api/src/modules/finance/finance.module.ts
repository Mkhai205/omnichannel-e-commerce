import { Module } from '@nestjs/common';
import { FinanceRepository } from './finance.repository';
import { FinanceService } from './finance.service';

@Module({
  providers: [FinanceRepository, FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}
