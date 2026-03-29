import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import type { ApiResponse } from '@repo/shared-types';

interface PrismaLikeError {
  code?: string;
  meta?: {
    target?: unknown;
  };
  message?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    const prismaError = this.asPrismaLikeError(exception);

    const status = this.resolveStatus(exception, prismaError);

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message: string | string[] = 'Internal server error';
    let errors: unknown = null;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseBody = exceptionResponse as {
        message?: string | string[];
        error?: unknown;
      };

      message = responseBody.message ?? message;
      errors = responseBody.error ?? null;
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    if (prismaError?.code === 'P2002') {
      message = this.buildUniqueConstraintMessage(prismaError);
      errors = null;
    }

    const normalizedMessage = Array.isArray(message)
      ? this.sanitizeMessage(message[0] ?? 'Validation failed')
      : this.sanitizeMessage(message);

    const errorResponse: ApiResponse<null> = {
      success: false,
      statusCode: status,
      message: normalizedMessage,
      errors: Array.isArray(message) ? message : errors,
      data: null,
    };

    response.status(status).json(errorResponse);
  }

  private resolveStatus(
    exception: unknown,
    prismaError: PrismaLikeError | null,
  ): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    if (prismaError?.code === 'P2002') {
      return HttpStatus.CONFLICT;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private asPrismaLikeError(exception: unknown): PrismaLikeError | null {
    if (typeof exception !== 'object' || exception === null) {
      return null;
    }

    return exception as PrismaLikeError;
  }

  private sanitizeMessage(value: string): string {
    const withoutControlChars = Array.from(value)
      .filter((char) => {
        const code = char.charCodeAt(0);
        return code >= 32 || char === '\n' || char === '\r' || char === '\t';
      })
      .join('');

    return withoutControlChars
      .replace(/\\u001b\[[0-9;]*m/gi, '')
      .replace(/\[[0-9;]*m/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private buildUniqueConstraintMessage(error: PrismaLikeError): string {
    const target = error.meta?.target;
    const fields = Array.isArray(target)
      ? target
          .filter((item): item is string => typeof item === 'string')
          .join(', ')
      : null;

    if (fields) {
      return `Duplicate value for: ${fields}`;
    }

    return 'Duplicate value violates unique constraint';
  }
}
