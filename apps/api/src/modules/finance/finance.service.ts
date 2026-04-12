import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Prisma } from '@repo/database';
import type {
  AdminDashboardKpiResponse,
  AdminDashboardTrendPoint,
  AdminPaymentListItem,
  AdminPaymentsFilterRequest,
  AdminPaymentsListResponse,
  AdminSettlementListItem,
  AdminSettlementsFilterRequest,
  AdminSettlementsListResponse,
  SellerPaymentCashflowPoint,
  SellerPaymentTransactionItem,
  SellerPaymentsFilterRequest,
  SellerPaymentsOverviewResponse,
  SellerPaymentsTransactionsResponse,
  SellerWalletSummaryResponse,
} from '@repo/shared-types';
import { FinanceRepository } from './finance.repository';
import { SETTLEMENT_CONFIG_KEY } from '../../core/config/env.constant';
import type {
  AdminPaymentRecord,
  AdminSettlementRecord,
  KpiTrendOrderRecord,
  SellerPaymentOrderRecord,
  SellerSettlementCashflowRecord,
} from './finance.repository';

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

  async getSellerWalletSummary(
    sellerUserId: string,
  ): Promise<SellerWalletSummaryResponse> {
    let wallet =
      await this.financeRepository.findSellerWalletByUserId(sellerUserId);

    if (!wallet) {
      const shop =
        await this.financeRepository.findSellerShopIdByUserId(sellerUserId);

      if (!shop) {
        throw new NotFoundException('Seller shop not found');
      }

      wallet = await this.financeRepository.upsertSellerWalletByShopId(shop.id);
    }

    return {
      id: wallet.id,
      shopId: wallet.shopId,
      availableBalance: this.normalizeMoney(wallet.availableBalance.toString()),
      pendingBalance: this.normalizeMoney(wallet.pendingBalance.toString()),
      totalCredited: this.normalizeMoney(wallet.totalCredited.toString()),
      createdAt: wallet.createdAt.toISOString(),
      updatedAt: wallet.updatedAt.toISOString(),
    };
  }

  async getSellerTransactions(
    sellerUserId: string,
    filters: SellerPaymentsFilterRequest,
  ): Promise<SellerPaymentsTransactionsResponse> {
    const page = this.resolvePage(filters.page);
    const limit = this.resolveLimit(filters.limit);

    if (filters.status === 'mismatch') {
      return {
        data: [],
        meta: {
          page,
          limit,
          totalItems: 0,
          totalPages: 0,
        },
      };
    }

    const [orders, totalItems] = await Promise.all([
      this.financeRepository.findSellerPaymentOrdersByUserId(sellerUserId, {
        page,
        limit,
        status: filters.status,
      }),
      this.financeRepository.countSellerPaymentOrdersByUserId(
        sellerUserId,
        filters.status,
      ),
    ]);

    return {
      data: orders.map((order) => this.toSellerPaymentTransactionItem(order)),
      meta: {
        page,
        limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / limit),
      },
    };
  }

  async getSellerPaymentsOverview(
    sellerUserId: string,
  ): Promise<SellerPaymentsOverviewResponse> {
    const settledAfterOrAt = this.startOfDayFromOffset(4);

    const [summary, recentSettlements] = await Promise.all([
      this.financeRepository.aggregateSellerSettlementSummary(sellerUserId),
      this.financeRepository.findSellerSettlementsForCashflow(
        sellerUserId,
        settledAfterOrAt,
      ),
    ]);

    const cashflow = this.buildCashflowPoints(recentSettlements);
    const trendPercent = this.calculateTrendPercent(cashflow);

    return {
      totalRevenue: this.normalizeMoney(summary._sum.netAmount?.toString()),
      trendPercent,
      trendLabel: 'so với kỳ trước',
      discrepancyAmount: this.normalizeMoney('0'),
      discrepancyCount: 0,
      cashflow,
    };
  }

  async getAdminPayments(
    filters: AdminPaymentsFilterRequest,
  ): Promise<AdminPaymentsListResponse> {
    const page = this.resolvePage(filters.page);
    const limit = this.resolveLimit(filters.limit);
    const search = this.normalizeSearch(filters.search);
    const createdFrom = this.resolveStartOfDate(filters.createdFrom);
    const createdToExclusive = this.resolveEndExclusiveOfDate(
      filters.createdTo,
    );

    if (
      createdFrom &&
      createdToExclusive &&
      createdFrom >= createdToExclusive
    ) {
      throw new BadRequestException('createdFrom must not be after createdTo');
    }

    const [payments, totalItems] = await Promise.all([
      this.financeRepository.findAdminPayments({
        page,
        limit,
        status: filters.status,
        provider: filters.provider,
        search,
        createdFrom,
        createdToExclusive,
      }),
      this.financeRepository.countAdminPayments({
        status: filters.status,
        provider: filters.provider,
        search,
        createdFrom,
        createdToExclusive,
      }),
    ]);

    this.logger.log(
      `[ADMIN_FINANCE] payments page=${page} limit=${limit} total=${totalItems} status=${filters.status ?? 'ALL'} provider=${filters.provider ?? 'ALL'}`,
    );

    return {
      data: payments.map((payment) => this.toAdminPaymentItem(payment)),
      meta: {
        page,
        limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / limit),
      },
    };
  }

  async getAdminSettlements(
    filters: AdminSettlementsFilterRequest,
  ): Promise<AdminSettlementsListResponse> {
    const page = this.resolvePage(filters.page);
    const limit = this.resolveLimit(filters.limit);
    const search = this.normalizeSearch(filters.search);
    const settledFrom = this.resolveStartOfDate(filters.settledFrom);
    const settledToExclusive = this.resolveEndExclusiveOfDate(
      filters.settledTo,
    );

    if (
      settledFrom &&
      settledToExclusive &&
      settledFrom >= settledToExclusive
    ) {
      throw new BadRequestException('settledFrom must not be after settledTo');
    }

    const [settlements, totalItems] = await Promise.all([
      this.financeRepository.findAdminSettlements({
        page,
        limit,
        status: filters.status,
        search,
        settledFrom,
        settledToExclusive,
      }),
      this.financeRepository.countAdminSettlements({
        status: filters.status,
        search,
        settledFrom,
        settledToExclusive,
      }),
    ]);

    this.logger.log(
      `[ADMIN_FINANCE] settlements page=${page} limit=${limit} total=${totalItems} status=${filters.status ?? 'ALL'}`,
    );

    return {
      data: settlements.map((settlement) =>
        this.toAdminSettlementItem(settlement),
      ),
      meta: {
        page,
        limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / limit),
      },
    };
  }

  async getAdminDashboardKpi(): Promise<AdminDashboardKpiResponse> {
    const todayStart = this.startOfDayFromOffset(0);
    const trendStart = this.startOfDayFromOffset(6);

    const [
      totalUsers,
      totalShops,
      pendingShops,
      totalOrders,
      todayOrders,
      gmv,
      totalPayments,
      successfulPayments,
      pendingPayments,
      pendingSettlements,
      trendOrders,
    ] = await Promise.all([
      this.financeRepository.countTotalUsers(),
      this.financeRepository.countTotalShops(),
      this.financeRepository.countPendingShops(),
      this.financeRepository.countTotalOrders(),
      this.financeRepository.countOrdersCreatedAfterOrAt(todayStart),
      this.financeRepository.aggregateGrossMerchandiseValue(),
      this.financeRepository.countTotalPayments(),
      this.financeRepository.countSuccessfulPayments(),
      this.financeRepository.countPendingPayments(),
      this.financeRepository.countPendingSettlements(),
      this.financeRepository.findKpiTrendOrders(trendStart),
    ]);

    const paymentSuccessRate =
      totalPayments === 0
        ? 0
        : Number(((successfulPayments / totalPayments) * 100).toFixed(1));

    this.logger.log(
      `[ADMIN_FINANCE] dashboard_kpi users=${totalUsers} shops=${totalShops} orders=${totalOrders} totalPayments=${totalPayments}`,
    );

    return {
      totalUsers,
      totalShops,
      pendingShops,
      totalOrders,
      todayOrders,
      totalGmv: this.normalizeMoney(gmv._sum.totalAmount?.toString()),
      paymentSuccessRate,
      successfulPayments,
      totalPayments,
      pendingPayments,
      pendingSettlements,
      trend: this.buildAdminKpiTrend(trendOrders),
      generatedAt: new Date().toISOString(),
    };
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

  private normalizeMoney(value?: string | null): string {
    if (!value) {
      return '0.00';
    }

    const amount = Number(value);

    if (!Number.isFinite(amount)) {
      return '0.00';
    }

    return amount.toFixed(2);
  }

  private resolvePage(page?: number): number {
    if (!page || page < 1) {
      return 1;
    }

    return Math.floor(page);
  }

  private resolveLimit(limit?: number): number {
    if (!limit || limit < 1) {
      return 20;
    }

    return Math.min(100, Math.floor(limit));
  }

  private normalizeSearch(value?: string): string | undefined {
    const normalized = value?.trim();

    if (!normalized) {
      return undefined;
    }

    return normalized;
  }

  private resolveStartOfDate(value?: string): Date | undefined {
    if (!value) {
      return undefined;
    }

    const date = this.parseIsoDate(value);

    date.setHours(0, 0, 0, 0);
    return date;
  }

  private resolveEndExclusiveOfDate(value?: string): Date | undefined {
    if (!value) {
      return undefined;
    }

    const date = this.parseIsoDate(value);

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 1);

    return date;
  }

  private parseIsoDate(value: string): Date {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`Invalid date: ${value}`);
    }

    return date;
  }

  private toAdminPaymentItem(
    payment: AdminPaymentRecord,
  ): AdminPaymentListItem {
    return {
      id: payment.id,
      userId: payment.userId,
      customerName: payment.user.fullName,
      customerEmail: payment.user.email,
      provider: payment.provider,
      status: payment.status,
      txnRef: payment.txnRef,
      gatewayTransactionNo: payment.gatewayTransactionNo,
      amount: this.normalizeMoney(payment.amount.toString()),
      currency: payment.currency,
      bankCode: payment.bankCode,
      orderCount: payment.orders.length,
      paidAt: payment.paidAt?.toISOString() ?? null,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
    };
  }

  private toAdminSettlementItem(
    settlement: AdminSettlementRecord,
  ): AdminSettlementListItem {
    return {
      id: settlement.id,
      orderId: settlement.orderId,
      orderNumber: settlement.order.orderNumber,
      shopId: settlement.shopId,
      shopName: settlement.shop.shopName,
      sellerName: settlement.shop.user.fullName,
      sellerWalletId: settlement.sellerWalletId,
      status: settlement.status,
      grossAmount: this.normalizeMoney(settlement.grossAmount.toString()),
      commissionAmount: this.normalizeMoney(
        settlement.commissionAmount.toString(),
      ),
      netAmount: this.normalizeMoney(settlement.netAmount.toString()),
      settledAt: settlement.settledAt.toISOString(),
      createdAt: settlement.createdAt.toISOString(),
      updatedAt: settlement.updatedAt.toISOString(),
    };
  }

  private buildAdminKpiTrend(
    orders: KpiTrendOrderRecord[],
  ): AdminDashboardTrendPoint[] {
    const days = Array.from({ length: 7 }, (_, index) =>
      this.startOfDayFromOffset(6 - index),
    );

    const buckets = new Map<string, { orderCount: number; gmv: number }>();

    for (const day of days) {
      buckets.set(this.toDateKey(day), { orderCount: 0, gmv: 0 });
    }

    for (const order of orders) {
      const key = this.toDateKey(order.createdAt);
      const bucket = buckets.get(key);

      if (!bucket) {
        continue;
      }

      bucket.orderCount += 1;
      bucket.gmv += Number(order.totalAmount);
    }

    return days.map((day) => {
      const key = this.toDateKey(day);
      const bucket = buckets.get(key) ?? { orderCount: 0, gmv: 0 };

      return {
        label: this.toCashflowLabel(day),
        orderCount: bucket.orderCount,
        gmv: Math.round(bucket.gmv),
      };
    });
  }

  private toSellerPaymentTransactionItem(
    order: SellerPaymentOrderRecord,
  ): SellerPaymentTransactionItem {
    const sellerSettlement = order.sellerSettlement;
    const settled =
      order.settlementStatus === 'SETTLED' && sellerSettlement !== null;

    return {
      id: settled && sellerSettlement ? sellerSettlement.id : order.id,
      orderId: order.id,
      orderNumber: order.orderNumber,
      transactionType: settled
        ? 'Quyết toán đơn hàng'
        : 'Thanh toán đơn hàng (chờ đối soát)',
      amount: settled
        ? this.normalizeMoney(sellerSettlement?.netAmount.toString())
        : this.normalizeMoney(order.totalAmount.toString()),
      platformFee: settled
        ? this.normalizeMoney(sellerSettlement?.commissionAmount.toString())
        : null,
      status: settled ? 'SETTLED' : 'PENDING',
      warningLabel: null,
      occurredAt: (
        order.settledAt ??
        order.sellerSettlement?.settledAt ??
        order.updatedAt
      ).toISOString(),
    };
  }

  private buildCashflowPoints(
    records: SellerSettlementCashflowRecord[],
  ): SellerPaymentCashflowPoint[] {
    const days = Array.from({ length: 5 }, (_, index) =>
      this.startOfDayFromOffset(4 - index),
    );

    const map = new Map<
      string,
      { revenue: number; platformFee: number; profit: number }
    >();

    for (const day of days) {
      map.set(this.toDateKey(day), { revenue: 0, platformFee: 0, profit: 0 });
    }

    for (const record of records) {
      const key = this.toDateKey(record.settledAt);
      const bucket = map.get(key);

      if (!bucket) {
        continue;
      }

      bucket.revenue += Number(record.grossAmount);
      bucket.platformFee += Number(record.commissionAmount);
      bucket.profit += Number(record.netAmount);
    }

    return days.map((day, index) => {
      const key = this.toDateKey(day);
      const bucket = map.get(key) ?? { revenue: 0, platformFee: 0, profit: 0 };

      return {
        label: this.toCashflowLabel(day),
        revenue: Math.round(bucket.revenue),
        platformFee: Math.round(bucket.platformFee),
        profit: Math.round(bucket.profit),
        emphasize: index === days.length - 1,
      };
    });
  }

  private calculateTrendPercent(
    cashflow: SellerPaymentCashflowPoint[],
  ): number {
    if (cashflow.length < 2) {
      return 0;
    }

    const latest = cashflow[cashflow.length - 1]?.profit ?? 0;
    const previous = cashflow[cashflow.length - 2]?.profit ?? 0;

    if (previous === 0) {
      return latest > 0 ? 100 : 0;
    }

    const trend = ((latest - previous) / Math.abs(previous)) * 100;

    return Number(trend.toFixed(1));
  }

  private startOfDayFromOffset(daysAgo: number): Date {
    const date = new Date();

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - daysAgo);

    return date;
  }

  private toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private toCashflowLabel(date: Date): string {
    const now = new Date();

    if (this.toDateKey(now) === this.toDateKey(date)) {
      return 'HÔM NAY';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${day}/${month}`;
  }
}
