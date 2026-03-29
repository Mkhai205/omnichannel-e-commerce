import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailerPackage from 'nodemailer';
import type {
  MailClientConfig,
  SendMailParams,
  SendMailResult,
} from './mail.types';
import { MAIL_CONFIG_KEY } from 'src/core/config/env.constant';

interface MailSendInfo {
  messageId: string;
  accepted: unknown[];
  rejected: unknown[];
}

interface MailTransporter {
  verify(): Promise<void>;
  sendMail(options: Record<string, unknown>): Promise<MailSendInfo>;
}

interface NodemailerModule {
  createTransport(options: Record<string, unknown>): MailTransporter;
}

@Injectable()
export class GmailSmtpClientService implements OnModuleInit {
  private readonly logger = new Logger(GmailSmtpClientService.name);
  private readonly config: MailClientConfig;
  private transporter: MailTransporter | null = null;
  private readonly nodemailer =
    nodemailerPackage as unknown as NodemailerModule;

  constructor(private readonly configService: ConfigService) {
    this.config = this.getConfig();

    if (this.config.enabled) {
      this.transporter = this.nodemailer.createTransport({
        host: this.config.host,
        port: this.config.port,
        secure: this.config.secure,
        auth: {
          user: this.config.user,
          pass: this.config.password,
        },
        connectionTimeout: this.config.connectionTimeout,
      });
    }
  }

  async onModuleInit(): Promise<void> {
    if (!this.config.enabled) {
      this.logger.warn('❌ Mail service is disabled (MAIL_ENABLED=false)');
      return;
    }

    await this.ping();
    this.logger.log('📩 Gmail SMTP service initialized');
  }

  async ping(): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    const transporter = this.getTransporter();

    try {
      await transporter.verify();
    } catch (error: unknown) {
      this.logger.error(
        'Unable to connect to Gmail SMTP',
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException(
        'Unable to connect to mail service',
      );
    }
  }

  async sendMail(params: SendMailParams): Promise<SendMailResult> {
    if (!this.config.enabled) {
      throw new ServiceUnavailableException('Mail service is disabled');
    }

    const transporter = this.getTransporter();

    try {
      const info = await transporter.sendMail({
        to: params.to,
        cc: params.cc,
        bcc: params.bcc,
        replyTo: params.replyTo,
        subject: params.subject,
        text: params.text,
        html: params.html,
        from: this.buildFromHeader(params.fromEmail, params.fromName),
      });

      return {
        messageId: info.messageId,
        accepted: info.accepted
          .map((item) => this.normalizeRecipient(item))
          .filter((item) => item.length > 0),
        rejected: info.rejected
          .map((item) => this.normalizeRecipient(item))
          .filter((item) => item.length > 0),
      };
    } catch (error: unknown) {
      this.logger.error(
        'Failed to send email via Gmail SMTP',
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException('Unable to send email');
    }
  }

  private buildFromHeader(fromEmail?: string, fromName?: string): string {
    const email = (fromEmail ?? this.config.defaultFromEmail ?? '').trim();

    if (!email) {
      throw new InternalServerErrorException(
        'MAIL_FROM_EMAIL is required to send email',
      );
    }

    const name = (fromName ?? this.config.defaultFromName).trim();
    return name ? `${name} <${email}>` : email;
  }

  private getTransporter(): MailTransporter {
    if (!this.transporter) {
      throw new ServiceUnavailableException(
        'Mail transporter is not initialized',
      );
    }

    return this.transporter;
  }

  private normalizeRecipient(recipient: unknown): string {
    if (typeof recipient === 'string') {
      return recipient;
    }

    if (
      typeof recipient === 'object' &&
      recipient !== null &&
      'address' in recipient
    ) {
      const address = (recipient as { address?: unknown }).address;
      if (typeof address === 'string') {
        return address;
      }
    }

    return '';
  }

  private getConfig(): MailClientConfig {
    const enabled = this.configService.get<boolean>(
      'MAIL_ENABLED',
      MAIL_CONFIG_KEY.MAIL_ENABLED,
    );
    const host = this.configService.get<string>(
      'MAIL_SMTP_HOST',
      MAIL_CONFIG_KEY.MAIL_SMTP_HOST,
    );
    const port = this.configService.get<number>(
      'MAIL_SMTP_PORT',
      MAIL_CONFIG_KEY.MAIL_SMTP_PORT,
    );
    const secure = this.configService.get<boolean>(
      'MAIL_SMTP_SECURE',
      MAIL_CONFIG_KEY.MAIL_SMTP_SECURE,
    );
    const connectionTimeout = this.configService.get<number>(
      'MAIL_SMTP_CONNECTION_TIMEOUT',
      MAIL_CONFIG_KEY.MAIL_SMTP_CONNECTION_TIMEOUT,
    );
    const user = this.configService.get<string>('GMAIL_SMTP_USER');
    const password = this.configService.get<string>('GMAIL_SMTP_APP_PASSWORD');
    const defaultFromEmail = this.configService.get<string>('MAIL_FROM_EMAIL');
    const defaultFromName = this.configService.get<string>(
      'MAIL_FROM_NAME',
      MAIL_CONFIG_KEY.MAIL_FROM_NAME,
    );

    if (!enabled) {
      return {
        enabled,
        host,
        port,
        secure,
        connectionTimeout,
        defaultFromName,
        defaultFromEmail,
      };
    }

    if (!user || !password) {
      throw new Error(
        'GMAIL_SMTP_USER and GMAIL_SMTP_APP_PASSWORD are required when mail is enabled',
      );
    }

    return {
      enabled,
      host,
      port,
      secure,
      connectionTimeout,
      user,
      password,
      defaultFromEmail,
      defaultFromName,
    };
  }
}
