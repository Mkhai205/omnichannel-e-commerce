export interface ApiResponseMetadata {
    total?: number;
    page?: number;
    limit?: number;
    [key: string]: unknown;
}

// Standard envelope for all API responses across backend and frontend.
export interface ApiResponse<T = unknown> {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
    metadata?: ApiResponseMetadata;
    errors?: unknown;
}
