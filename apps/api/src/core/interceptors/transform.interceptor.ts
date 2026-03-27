import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { ApiResponse, ApiResponseMetadata } from '@repo/shared-types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type UnknownRecord = Record<string, unknown>;

function isRecord(payload: unknown): payload is UnknownRecord {
  return typeof payload === 'object' && payload !== null;
}

function isApiResponse<T>(payload: unknown): payload is ApiResponse<T> {
  if (!isRecord(payload)) {
    return false;
  }

  return (
    typeof payload.success === 'boolean' &&
    typeof payload.statusCode === 'number'
  );
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<{ statusCode: number }>();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((payload: unknown): ApiResponse<T> => {
        if (isApiResponse<T>(payload)) {
          return payload;
        }

        if (isRecord(payload)) {
          const rawMessage = payload['message'];
          const rawMetadata = payload['metadata'];
          const data = Object.prototype.hasOwnProperty.call(payload, 'data')
            ? payload['data']
            : payload;
          const metadata = isRecord(rawMetadata)
            ? (rawMetadata as ApiResponseMetadata)
            : undefined;

          return {
            success: true,
            statusCode,
            message:
              typeof rawMessage === 'string' ? rawMessage : 'Successfully!',
            data: data as T,
            metadata,
          } satisfies ApiResponse<T>;
        }

        return {
          success: true,
          statusCode,
          message: 'Successfully!',
          data: payload as T,
        } satisfies ApiResponse<T>;
      }),
    );
  }
}
