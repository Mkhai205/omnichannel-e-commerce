import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ShippingService } from './shipping.service';

@Injectable()
export class ShippingCron {
  private readonly logger = new Logger(ShippingCron.name);
  private isRunning = false;

  constructor(private readonly shippingService: ShippingService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async runAutoShippingTick(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn(
        '[AUTO_SHIPPING] Previous tick is still running. Skip current tick.',
      );
      return;
    }

    this.isRunning = true;

    try {
      await this.shippingService.processAutoDelivery();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`[AUTO_SHIPPING] Tick failed: ${errorMessage}`);
    } finally {
      this.isRunning = false;
    }
  }
}
