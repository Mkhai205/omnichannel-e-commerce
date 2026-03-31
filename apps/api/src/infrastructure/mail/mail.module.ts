import { Global, Module } from '@nestjs/common';
import { GmailSmtpClientService } from './gmail.client';
import { MailTemplateService } from './mail-template.service';
import { MailService } from './mail.service';

@Global()
@Module({
  providers: [GmailSmtpClientService, MailService, MailTemplateService],
  exports: [MailService, MailTemplateService],
})
export class MailModule {}
