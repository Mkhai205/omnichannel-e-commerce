/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { ApiResponse, ApiResponseMetadata } from '@repo/shared-types';

interface CreateSuccessResponseOptions {
  statusCode?: number;
  message?: string;
  metadata?: ApiResponseMetadata;
}

export function createSuccessResponse<T>(
  data: T,
  options?: CreateSuccessResponseOptions,
): ApiResponse<T> {
  return {
    success: true,
    statusCode: options?.statusCode ?? 200,
    message: options?.message ?? 'Successfully!',
    data,
    metadata: options?.metadata,
  };
}
