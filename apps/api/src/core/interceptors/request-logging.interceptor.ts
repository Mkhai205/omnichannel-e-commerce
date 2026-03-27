import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const now = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const method = request.method;
    const originalUrl = request.originalUrl ?? request.url;
    const ipAddress = request.ip;
    const userAgent = request.headers['user-agent'] ?? '-';

    return next.handle().pipe(
      tap({
        next: () => {
          const durationMs = Date.now() - now;
          const statusCode = response.statusCode;

          this.logger.log(
            `${method} ${originalUrl} ${statusCode} - ${durationMs}ms - ip=${ipAddress} ua="${userAgent}"`,
          );
        },
        error: () => {
          const durationMs = Date.now() - now;
          const statusCode = response.statusCode;

          this.logger.error(
            `${method} ${originalUrl} ${statusCode} - ${durationMs}ms - ip=${ipAddress} ua="${userAgent}"`,
          );
        },
      }),
    );
  }
}
