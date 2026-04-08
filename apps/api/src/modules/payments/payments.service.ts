import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@repo/database';
import type {
  CreateVnpayPaymentUrlRequest,
  CreateVnpayPaymentUrlResponse,
  PaymentStatusByOrderResponse,
  VnpayIpnResponse,
  VnpayReturnResponse,
} from '@repo/shared-types';
import { createHash } from 'crypto';
import type { ReturnQueryFromVNPay } from 'vnpay';
import {
  HashAlgorithm,
  ProductCode,
  VNPay,
  VnpLocale,
  dateFormat,
} from 'vnpay';
import { FinanceService } from '../finance/finance.service';
import { PaymentsRepository } from './payments.repository';
import { VNPAY_CONFIG_KEY } from '../../core/config/env.constant';

const IPN_SUCCESS: VnpayIpnResponse = {
  RspCode: '00',
  Message: 'Confirm Success',
};

const IPN_ORDER_NOT_FOUND: VnpayIpnResponse = {
  RspCode: '01',
  Message: 'Order not found',
};

const IPN_ORDER_ALREADY_CONFIRMED: VnpayIpnResponse = {
  RspCode: '02',
  Message: 'Order already confirmed',
};

const IPN_INVALID_AMOUNT: VnpayIpnResponse = {
  RspCode: '04',
  Message: 'Invalid amount',
};

const IPN_FAIL_CHECKSUM: VnpayIpnResponse = {
  RspCode: '97',
  Message: 'Fail checksum',
};

const IPN_UNKNOWN_ERROR: VnpayIpnResponse = {
  RspCode: '99',
  Message: 'Unknown error',
};

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly vnpay: VNPay;
  private readonly vnpayReturnUrl: string;
  private readonly defaultLocale: VnpLocale;
  private readonly defaultOrderType: ProductCode;
  private readonly paymentExpiryMinutes: number;

  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly configService: ConfigService,
    private readonly financeService: FinanceService,
  ) {
    const tmnCode = this.getRequiredConfig('VNPAY_TMN_CODE');
    const secureSecret = this.getRequiredConfig('VNPAY_SECURE_SECRET');
    const vnpayHost = this.configService.get<string>(
      'VNPAY_HOST',
      VNPAY_CONFIG_KEY.VNPAY_HOST,
    );

    this.vnpayReturnUrl = this.getRequiredConfig('VNPAY_RETURN_URL');
    this.paymentExpiryMinutes = this.configService.get<number>(
      'VNPAY_PAYMENT_EXPIRE_MINUTES',
      VNPAY_CONFIG_KEY.VNPAY_PAYMENT_EXPIRE_MINUTES,
    );

    const locale = this.configService.get<string>(
      'VNPAY_LOCALE',
      VNPAY_CONFIG_KEY.VNPAY_LOCALE,
    );
    this.defaultLocale = locale === 'en' ? VnpLocale.EN : VnpLocale.VN;

    const orderType = this.configService
      .get<string>('VNPAY_ORDER_TYPE', ProductCode.Other)
      ?.trim();
    this.defaultOrderType = this.parseOrderType(orderType);

    this.vnpay = new VNPay({
      tmnCode,
      secureSecret,
      vnpayHost,
      testMode: true,
      hashAlgorithm: HashAlgorithm.SHA512,
      enableLog: false,
    });
  }

  async createVnpayPaymentUrl(
    userId: string,
    payload: CreateVnpayPaymentUrlRequest,
    clientIp: string,
    tx?: Prisma.TransactionClient,
  ): Promise<CreateVnpayPaymentUrlResponse> {
    const orderIds = [...new Set(payload.orderIds)];

    if (orderIds.length === 0) {
      throw new BadRequestException('orderIds must not be empty');
    }

    const ipAddress = this.normalizeIpAddress(clientIp);
    const locale = this.parseLocale(payload.locale);

    const operation = async (
      transactionClient: Prisma.TransactionClient,
    ): Promise<CreateVnpayPaymentUrlResponse> => {
      const orders =
        await this.paymentsRepository.findPendingOrdersByIdsForUser(
          userId,
          orderIds,
          transactionClient,
        );

      if (orders.length !== orderIds.length) {
        throw new NotFoundException(
          'Some orders were not found or are not pending payment',
        );
      }

      const totalAmountCents = orders.reduce((sum, order) => {
        return sum + this.parseMoneyToCents(order.totalAmount.toString());
      }, 0n);

      const gatewayAmount = this.toVnpayAmount(totalAmountCents);
      const now = new Date();
      const expiresAt = new Date(
        now.getTime() + this.paymentExpiryMinutes * 60 * 1000,
      );
      const txnRef = this.generateTxnRef(userId);
      const orderInfo = `Thanh toan don hang ${txnRef}`;

      const requestPayload = {
        vnp_Amount: gatewayAmount,
        vnp_IpAddr: ipAddress,
        vnp_TxnRef: txnRef,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: this.defaultOrderType,
        vnp_ReturnUrl: this.vnpayReturnUrl,
        vnp_Locale: locale,
        vnp_CreateDate: dateFormat(now),
        vnp_ExpireDate: dateFormat(expiresAt),
        ...(payload.bankCode?.trim() ? { vnp_BankCode: payload.bankCode } : {}),
      };

      const paymentUrl = this.vnpay.buildPaymentUrl(requestPayload);

      const payment = await this.paymentsRepository.createPaymentWithOrders(
        {
          userId,
          provider: 'VNPAY',
          status: 'PENDING',
          txnRef,
          amount: this.formatCents(totalAmountCents),
          currency: 'VND',
          orderInfo,
          requestPayload: this.toJsonValue(requestPayload),
          responsePayload: this.toJsonValue({}),
          expiresAt,
        },
        orderIds,
        transactionClient,
      );

      this.logger.log(
        `[VNPAY] Payment URL generated paymentId=${payment.id} txnRef=${txnRef} orderCount=${orderIds.length}`,
      );

      return {
        paymentId: payment.id,
        txnRef: payment.txnRef,
        orderIds: payment.orders.map((item) => item.orderId),
        totalAmount: this.normalizeMoney(payment.amount.toString()),
        paymentUrl,
        status: payment.status,
        expiresAt: payment.expiresAt?.toISOString() ?? null,
        createdAt: payment.createdAt.toISOString(),
      };
    };

    if (tx) {
      return operation(tx);
    }

    return this.paymentsRepository.runInTransaction(operation);
  }

  async getPaymentStatusByOrder(
    userId: string,
    orderId: string,
  ): Promise<PaymentStatusByOrderResponse> {
    const order =
      await this.paymentsRepository.findOrderByIdForUserWithLatestPayment(
        userId,
        orderId,
      );

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const latestPayment = order.paymentOrders.at(0)?.payment;

    return {
      orderId: order.id,
      orderStatus: order.status,
      shippedAt: order.shippedAt?.toISOString() ?? null,
      deliveredAt: order.deliveredAt?.toISOString() ?? null,
      settlementStatus: order.settlementStatus,
      settledAt: order.settledAt?.toISOString() ?? null,
      paymentId: latestPayment?.id,
      paymentStatus: latestPayment?.status,
      paymentProvider: latestPayment?.provider,
      txnRef: latestPayment?.txnRef,
      totalAmount: latestPayment
        ? this.normalizeMoney(latestPayment.amount.toString())
        : undefined,
      paidAt: latestPayment?.paidAt?.toISOString() ?? null,
      updatedAt: (latestPayment?.updatedAt ?? order.updatedAt).toISOString(),
    };
  }

  verifyVnpayReturn(query: Record<string, unknown>): VnpayReturnResponse {
    const verify = this.vnpay.verifyReturnUrl(this.toVnpayReturnQuery(query));

    return {
      txnRef: this.toNullableString(verify.vnp_TxnRef) ?? undefined,
      isVerified: Boolean(verify.isVerified),
      isSuccess: Boolean(verify.isSuccess),
      responseCode: this.toNullableString(verify.vnp_ResponseCode) ?? undefined,
      message: this.toNullableString(verify.message) ?? 'Unknown response',
    };
  }

  async processVnpayIpn(
    query: Record<string, unknown>,
  ): Promise<VnpayIpnResponse> {
    try {
      const normalizedQuery = this.toQueryRecord(query);
      const verify = this.vnpay.verifyIpnCall(
        normalizedQuery as unknown as ReturnQueryFromVNPay,
      );
      const txnRef = this.toNullableString(verify.vnp_TxnRef);
      const eventKey = this.buildWebhookEventKey(normalizedQuery);

      const existingWebhook =
        await this.paymentsRepository.findWebhookLogByEventKey(eventKey);

      if (existingWebhook) {
        this.logger.warn(`[VNPAY] Duplicate IPN ignored eventKey=${eventKey}`);
        return IPN_SUCCESS;
      }

      if (!verify.isVerified) {
        await this.paymentsRepository.createWebhookLog({
          provider: 'VNPAY',
          eventKey,
          txnRef: txnRef ?? 'UNKNOWN',
          isVerified: false,
          isSuccess: false,
          responseCode: this.toNullableString(verify.vnp_ResponseCode),
          message: this.toNullableString(verify.message),
          payload: this.toJsonValue({ query: normalizedQuery, verify }),
        });

        this.logger.warn(
          `[VNPAY] Invalid IPN checksum txnRef=${txnRef ?? 'UNKNOWN'}`,
        );
        return IPN_FAIL_CHECKSUM;
      }

      if (!txnRef) {
        await this.paymentsRepository.createWebhookLog({
          provider: 'VNPAY',
          eventKey,
          txnRef: 'UNKNOWN',
          isVerified: true,
          isSuccess: false,
          responseCode: this.toNullableString(verify.vnp_ResponseCode),
          message: 'Missing txnRef from VNPay payload',
          payload: this.toJsonValue({ query: normalizedQuery, verify }),
        });

        return IPN_ORDER_NOT_FOUND;
      }

      return this.paymentsRepository.runInTransaction(async (tx) => {
        const duplicatedInTx =
          await this.paymentsRepository.findWebhookLogByEventKey(eventKey, tx);

        if (duplicatedInTx) {
          return IPN_SUCCESS;
        }

        const payment = await this.paymentsRepository.findPaymentByTxnRef(
          txnRef,
          tx,
        );

        if (!payment) {
          await this.paymentsRepository.createWebhookLog(
            {
              provider: 'VNPAY',
              eventKey,
              txnRef,
              isVerified: true,
              isSuccess: false,
              responseCode: this.toNullableString(verify.vnp_ResponseCode),
              message: 'Payment not found for txnRef',
              payload: this.toJsonValue({ query: normalizedQuery, verify }),
            },
            tx,
          );

          return IPN_ORDER_NOT_FOUND;
        }

        const expectedAmount = this.toVnpayAmount(
          this.parseMoneyToCents(payment.amount.toString()),
        );

        if (Number(verify.vnp_Amount) !== expectedAmount) {
          await this.paymentsRepository.createWebhookLog(
            {
              paymentId: payment.id,
              provider: 'VNPAY',
              eventKey,
              txnRef,
              isVerified: true,
              isSuccess: false,
              responseCode: this.toNullableString(verify.vnp_ResponseCode),
              message: `Amount mismatch expected=${expectedAmount} actual=${String(verify.vnp_Amount)}`,
              payload: this.toJsonValue({ query: normalizedQuery, verify }),
            },
            tx,
          );

          this.logger.warn(
            `[VNPAY] Invalid amount txnRef=${txnRef} expected=${expectedAmount} actual=${String(verify.vnp_Amount)}`,
          );

          return IPN_INVALID_AMOUNT;
        }

        if (payment.status === 'SUCCESS') {
          await this.paymentsRepository.createWebhookLog(
            {
              paymentId: payment.id,
              provider: 'VNPAY',
              eventKey,
              txnRef,
              isVerified: true,
              isSuccess: true,
              responseCode: this.toNullableString(verify.vnp_ResponseCode),
              message: 'Payment already confirmed',
              payload: this.toJsonValue({ query: normalizedQuery, verify }),
            },
            tx,
          );

          return IPN_ORDER_ALREADY_CONFIRMED;
        }

        const isSuccess = Boolean(verify.isSuccess);

        await this.paymentsRepository.updatePaymentById(
          payment.id,
          {
            status: isSuccess ? 'SUCCESS' : 'FAILED',
            paidAt: isSuccess ? new Date() : null,
            failedReason: isSuccess
              ? null
              : (this.toNullableString(verify.message) ?? 'Payment failed'),
            gatewayTransactionNo: this.toNullableString(
              verify.vnp_TransactionNo,
            ),
            bankCode: this.toNullableString(verify.vnp_BankCode),
            responsePayload: this.toJsonValue({
              query: normalizedQuery,
              verify,
            }),
          },
          tx,
        );

        if (isSuccess) {
          await this.paymentsRepository.updateOrdersToPaid(
            payment.orders.map((item) => item.orderId),
            tx,
          );

          await this.financeService.creditAdminOnPaymentSuccess(
            {
              paymentId: payment.id,
              txnRef: payment.txnRef,
              grossAmount: payment.amount.toString(),
            },
            tx,
          );
        }

        await this.paymentsRepository.createWebhookLog(
          {
            paymentId: payment.id,
            provider: 'VNPAY',
            eventKey,
            txnRef,
            isVerified: true,
            isSuccess,
            responseCode: this.toNullableString(verify.vnp_ResponseCode),
            message: this.toNullableString(verify.message),
            payload: this.toJsonValue({ query: normalizedQuery, verify }),
          },
          tx,
        );

        this.logger.log(
          `[VNPAY] IPN processed paymentId=${payment.id} txnRef=${txnRef} isSuccess=${String(isSuccess)}`,
        );

        return IPN_SUCCESS;
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`[VNPAY] IPN processing failed: ${errorMessage}`);

      return IPN_UNKNOWN_ERROR;
    }
  }

  private getRequiredConfig(key: string): string {
    const value = this.configService.get<string>(key)?.trim();

    if (!value) {
      throw new Error(`Missing required environment value ${key}`);
    }

    return value;
  }

  private parseLocale(locale?: string): VnpLocale {
    if (locale === 'en') {
      return VnpLocale.EN;
    }

    return this.defaultLocale;
  }

  private parseOrderType(rawOrderType?: string): ProductCode {
    if (!rawOrderType) {
      return ProductCode.Other;
    }

    const orderTypeEntries = Object.values(ProductCode);
    if (orderTypeEntries.includes(rawOrderType as ProductCode)) {
      return rawOrderType as ProductCode;
    }

    return ProductCode.Other;
  }

  private toQueryRecord(
    query: Record<string, unknown>,
  ): Record<string, string | number | boolean> {
    const normalized: Record<string, string | number | boolean> = {};

    for (const [key, value] of Object.entries(query)) {
      if (Array.isArray(value)) {
        const first = value[0] as unknown;
        if (first !== undefined && first !== null) {
          normalized[key] = this.stringifyUnknown(first);
        }

        continue;
      }

      if (value === undefined || value === null) {
        continue;
      }

      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        normalized[key] = value;
      } else {
        normalized[key] = this.stringifyUnknown(value);
      }
    }

    return normalized;
  }

  private toVnpayReturnQuery(
    query: Record<string, unknown>,
  ): ReturnQueryFromVNPay {
    return this.toQueryRecord(query) as unknown as ReturnQueryFromVNPay;
  }

  private buildWebhookEventKey(
    query: Record<string, string | number | boolean>,
  ): string {
    const canonical = Object.entries(query)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => `${key}=${String(value)}`)
      .join('&');

    const checksum = createHash('sha256').update(canonical).digest('hex');

    return `vnpay:${checksum}`;
  }

  private toJsonValue(value: unknown): Prisma.InputJsonValue {
    const serialized = JSON.stringify(value ?? {});
    const parsed: unknown = JSON.parse(serialized);

    return parsed as Prisma.InputJsonValue;
  }

  private parseMoneyToCents(value: string): bigint {
    const trimmed = value.trim();

    if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
      throw new BadRequestException('Invalid money value');
    }

    const [whole, fraction = ''] = trimmed.split('.');
    const normalizedFraction = `${fraction}00`.slice(0, 2);

    return BigInt(whole) * 100n + BigInt(normalizedFraction);
  }

  private formatCents(cents: bigint): string {
    const whole = cents / 100n;
    const fraction = (cents % 100n).toString().padStart(2, '0');

    return `${whole.toString()}.${fraction}`;
  }

  private normalizeMoney(value: string): string {
    return this.formatCents(this.parseMoneyToCents(value));
  }

  private toVnpayAmount(cents: bigint): number {
    if (cents % 100n !== 0n) {
      throw new BadRequestException(
        'VNPay only supports whole VND amount values',
      );
    }

    const amount = cents / 100n;

    if (amount > BigInt(Number.MAX_SAFE_INTEGER)) {
      throw new BadRequestException('Amount is too large for VNPay request');
    }

    return Number(amount);
  }

  private generateTxnRef(userId: string): string {
    const timestamp = Date.now().toString();
    const userSuffix = userId.replace(/-/g, '').slice(-6).toUpperCase();
    const randomPart = Math.random().toString(16).slice(2, 8).toUpperCase();

    return `PAY-${timestamp}-${userSuffix}${randomPart}`;
  }

  private normalizeIpAddress(ipAddress: string): string {
    const normalized = ipAddress.trim();

    if (!normalized) {
      return '127.0.0.1';
    }

    if (normalized.startsWith('::ffff:')) {
      return normalized.slice('::ffff:'.length);
    }

    if (normalized === '::1') {
      return '127.0.0.1';
    }

    return normalized;
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const normalized = this.stringifyUnknown(value).trim();

    return normalized.length > 0 ? normalized : null;
  }

  private stringifyUnknown(value: unknown): string {
    if (typeof value === 'string') {
      return value;
    }

    if (
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      typeof value === 'bigint'
    ) {
      return value.toString();
    }

    if (value === null || value === undefined) {
      return '';
    }

    const jsonString = JSON.stringify(value);

    return jsonString ?? '';
  }
}
