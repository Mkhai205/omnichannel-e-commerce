import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { GmailSmtpClientService } from './gmail.client';
import type { SendMailParams, SendMailResult } from './mail.types';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly gmailClient: GmailSmtpClientService) {}

  async sendMail(params: SendMailParams): Promise<SendMailResult> {
    if (!params.subject.trim()) {
      throw new BadRequestException('Mail subject is required');
    }

    if (!params.text && !params.html) {
      throw new BadRequestException('Mail content is required');
    }

    try {
      return await this.gmailClient.sendMail(params);
    } catch (error: unknown) {
      this.logger.error(
        `Failed to send email to ${Array.isArray(params.to) ? params.to.join(',') : params.to}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException('Unable to send email');
    }
  }

  async healthCheck(): Promise<{ healthy: boolean }> {
    await this.gmailClient.ping();
    return { healthy: true };
  }
}
