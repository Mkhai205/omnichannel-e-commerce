import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { Injectable } from '@nestjs/common';
import { renderFile } from 'ejs';

interface BuiltEmailTemplate {
  subject: string;
  text: string;
  html: string;
}

@Injectable()
export class MailTemplateService {
  async buildWelcomeEmailTemplate(
    fullName: string,
  ): Promise<BuiltEmailTemplate> {
    const safeFullName = this.normalizeName(fullName);
    const html = await this.renderTemplate('welcome-email.ejs', {
      fullName: safeFullName,
    });

    return {
      subject: 'Welcome to Omnichannel E-commerce',
      text: `Hi ${safeFullName}, welcome to Omnichannel E-commerce. Your account is ready to use.`,
      html,
    };
  }

  async buildVerifyEmailTemplate(
    fullName: string,
    verifyUrl: string,
  ): Promise<BuiltEmailTemplate> {
    const safeFullName = this.normalizeName(fullName);
    const safeVerifyUrl = verifyUrl.trim();
    const html = await this.renderTemplate('verify-email.ejs', {
      fullName: safeFullName,
      verifyUrl: safeVerifyUrl,
    });

    return {
      subject: 'Verify your email address',
      text: `Hi ${safeFullName}, please verify your email by visiting: ${safeVerifyUrl}`,
      html,
    };
  }

  async buildResetPasswordEmailTemplate(
    fullName: string,
    resetUrl: string,
  ): Promise<BuiltEmailTemplate> {
    const safeFullName = this.normalizeName(fullName);
    const safeResetUrl = resetUrl.trim();
    const html = await this.renderTemplate('reset-password.ejs', {
      fullName: safeFullName,
      resetUrl: safeResetUrl,
    });

    return {
      subject: 'Reset your password',
      text: `Hi ${safeFullName}, reset your password by visiting: ${safeResetUrl}`,
      html,
    };
  }

  private normalizeName(fullName: string): string {
    return fullName.trim() || 'there';
  }

  private async renderTemplate(
    templateFileName: string,
    data: Record<string, unknown>,
  ): Promise<string> {
    const templatePath = this.resolveTemplatePath(templateFileName);
    return renderFile(templatePath, data);
  }

  private resolveTemplatePath(templateFileName: string): string {
    const templateRelativePath = `infrastructure/mail/templates/${templateFileName}`;
    const distTemplatePath = resolve(
      process.cwd(),
      'dist',
      templateRelativePath,
    );

    if (existsSync(distTemplatePath)) {
      return distTemplatePath;
    }

    const srcTemplatePath = resolve(process.cwd(), 'src', templateRelativePath);

    if (existsSync(srcTemplatePath)) {
      return srcTemplatePath;
    }

    throw new Error(`Email template file not found: ${templateFileName}`);
  }
}
