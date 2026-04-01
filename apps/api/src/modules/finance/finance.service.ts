import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Prisma } from '@repo/database';
import { FinanceRepository } from './finance.repository';
import { SETTLEMENT_CONFIG_KEY } from 'src/core/config/env.constant';

interface AdminPaymentCreditInput {
  paymentId: string;
  txnRef: string;
  grossAmount: string;
}

@Injectable()
export class FinanceService {
  private readonly logger = new Logger(FinanceService.name);
  private readonly adminCommissionBps: bigint;

  constructor(
    private readonly financeRepository: FinanceRepository,
    private readonly configService: ConfigService,
  ) {
    const commissionPercent = this.configService.get<number>(
      'SETTLEMENT_ADMIN_COMMISSION_PERCENT',
      SETTLEMENT_CONFIG_KEY.SETTLEMENT_ADMIN_COMMISSION_PERCENT,
    );
    this.adminCommissionBps = this.toBasisPoints(commissionPercent);
  }

  async creditAdminOnPaymentSuccess(
    payload: AdminPaymentCreditInput,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    const idempotencyKey = `payment-success:${payload.paymentId}`;
    const existing =
      await this.financeRepository.findAdminLedgerByIdempotencyKey(
        idempotencyKey,
        tx,
      );

    if (existing) {
      return;
    }

    const grossCents = this.parseMoneyToCents(payload.grossAmount);
    const grossAmount = this.formatCents(grossCents);
    const adminWallet =
      await this.financeRepository.upsertDefaultAdminWallet(tx);

    await this.financeRepository.incrementAdminWalletForPaymentInflow(
      adminWallet.id,
      grossAmount,
      tx,
    );

    await this.financeRepository.createAdminWalletLedger(
      {
        adminWalletId: adminWallet.id,
        paymentId: payload.paymentId,
        type: 'PAYMENT_INFLOW',
        idempotencyKey,
        grossAmount,
        commission: this.formatCents(0n),
        netAmount: grossAmount,
        note: `VNPay success credit for txnRef ${payload.txnRef}`,
      },
      tx,
    );

    this.logger.log(
      `[FINANCE] Admin credited paymentId=${payload.paymentId} txnRef=${payload.txnRef} amount=${grossAmount}`,
    );
  }

  async settleSellerOnDeliveredOrders(
    orderIds: string[],
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    const uniqueOrderIds = [...new Set(orderIds)];

    if (uniqueOrderIds.length === 0) {
      return;
    }

    const orders = await this.financeRepository.findDeliveredSettledOrdersByIds(
      uniqueOrderIds,
      tx,
    );

    if (orders.length === 0) {
      return;
    }

    const adminWallet =
      await this.financeRepository.upsertDefaultAdminWallet(tx);

    for (const order of orders) {
      const existingSettlement =
        await this.financeRepository.findSellerSettlementByOrderId(
          order.id,
          tx,
        );

      if (existingSettlement) {
        continue;
      }

      const grossCents = this.parseMoneyToCents(order.totalAmount.toString());
      const commissionCents = this.calculateCommissionCents(grossCents);
      const netCents = grossCents - commissionCents;

      const grossAmount = this.formatCents(grossCents);
      const commissionAmount = this.formatCents(commissionCents);
      const netAmount = this.formatCents(netCents);
      const idempotencyKey = `order-settlement:${order.id}`;

      const existingAdminLedger =
        await this.financeRepository.findAdminLedgerByIdempotencyKey(
          idempotencyKey,
          tx,
        );

      if (existingAdminLedger) {
        continue;
      }

      const sellerWallet =
        await this.financeRepository.upsertSellerWalletByShopId(
          order.shopId,
          tx,
        );

      await this.financeRepository.createSellerSettlement(
        {
          orderId: order.id,
          shopId: order.shopId,
          sellerWalletId: sellerWallet.id,
          idempotencyKey,
          status: 'COMPLETED',
          grossAmount,
          commissionAmount,
          netAmount,
          settledAt: order.settledAt ?? new Date(),
        },
        tx,
      );

      await this.financeRepository.incrementSellerWalletBalance(
        sellerWallet.id,
        netAmount,
        tx,
      );

      await this.financeRepository.incrementAdminWalletForSellerSettlement(
        adminWallet.id,
        grossAmount,
        commissionAmount,
        netAmount,
        tx,
      );

      await this.financeRepository.createAdminWalletLedger(
        {
          adminWalletId: adminWallet.id,
          orderId: order.id,
          type: 'SELLER_SETTLEMENT',
          idempotencyKey,
          grossAmount,
          commission: commissionAmount,
          netAmount,
          note: `Seller settlement for order ${order.id}`,
        },
        tx,
      );

      this.logger.log(
        `[FINANCE] Seller settled orderId=${order.id} gross=${grossAmount} commission=${commissionAmount} net=${netAmount}`,
      );
    }
  }

  private toBasisPoints(percent: number): bigint {
    if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
      throw new Error(
        'SETTLEMENT_ADMIN_COMMISSION_PERCENT must be between 0 and 100',
      );
    }

    return BigInt(Math.round(percent * 100));
  }

  private calculateCommissionCents(grossCents: bigint): bigint {
    return (grossCents * this.adminCommissionBps + 5000n) / 10000n;
  }

  private parseMoneyToCents(value: string): bigint {
    const normalized = value.trim();

    if (!/^[-+]?\d+(\.\d{1,2})?$/.test(normalized)) {
      throw new Error(`Invalid money value: ${value}`);
    }

    const negative = normalized.startsWith('-');
    const absolute = normalized.replace(/^[-+]/, '');
    const [wholePart, fractionPart = ''] = absolute.split('.');
    const cents = BigInt(`${wholePart}${fractionPart.padEnd(2, '0')}`);

    return negative ? -cents : cents;
  }

  private formatCents(cents: bigint): string {
    const negative = cents < 0n;
    const absolute = negative ? -cents : cents;
    const whole = absolute / 100n;
    const fraction = absolute % 100n;

    return `${negative ? '-' : ''}${whole.toString()}.${fraction
      .toString()
      .padStart(2, '0')}`;
  }
}
