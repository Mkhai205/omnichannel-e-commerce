import type { Readable } from 'node:stream';

export type StorageBody = Buffer | string | Readable;

export interface UploadObjectParams {
  bucketName: string;
  objectName: string;
  body: StorageBody;
  size?: number;
  metadata?: Record<string, string>;
}

export interface PresignedUrlParams {
  bucketName: string;
  objectName: string;
  expiresInSeconds?: number;
  requestDate?: Date;
}

export interface ObjectStatResult {
  bucketName: string;
  objectName: string;
  etag?: string;
  lastModified?: Date;
  size: number;
  metadata: Record<string, string>;
}

export interface UploadedObjectResult {
  bucketName: string;
  objectName: string;
  etag: string;
  versionId?: string;
}

interface PutObjectResult {
  etag: string;
  versionId?: string | null;
}

export function mapUploadedObjectResult(
  bucketName: string,
  objectName: string,
  result: PutObjectResult,
): UploadedObjectResult {
  return {
    bucketName,
    objectName,
    etag: result.etag,
    versionId: result.versionId ?? undefined,
  };
}
