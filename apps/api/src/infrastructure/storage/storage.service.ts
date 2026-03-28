import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ItemBucketMetadata } from 'minio';
import { MinioClientService } from './minio.client';
import type {
  ObjectStatResult,
  PresignedUrlParams,
  UploadObjectParams,
  UploadedObjectResult,
} from './storage.types';
import { mapUploadedObjectResult } from './storage.types';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor(
    private readonly minioClientService: MinioClientService,
    private readonly configService: ConfigService,
  ) {}

  async healthCheck(): Promise<{ healthy: true }> {
    await this.minioClientService.ping();

    return { healthy: true };
  }

  async uploadObject(
    params: UploadObjectParams,
  ): Promise<UploadedObjectResult> {
    const bucketName = this.normalizeBucketName(params.bucketName);
    const objectName = this.normalizeObjectName(params.objectName);

    try {
      const uploadResult = await this.minioClientService.uploadObject(
        bucketName,
        objectName,
        params.body,
        params.size,
        this.toMetadata(params.metadata),
      );

      return mapUploadedObjectResult(bucketName, objectName, uploadResult);
    } catch (error: unknown) {
      this.logger.error(
        `Failed to upload object ${bucketName}/${objectName}`,
        error,
      );
      throw new InternalServerErrorException('File upload failed');
    }
  }

  async removeObject(bucketName: string, objectName: string): Promise<void> {
    const normalizedBucketName = this.normalizeBucketName(bucketName);
    const normalizedObjectName = this.normalizeObjectName(objectName);

    try {
      await this.minioClientService.removeObject(
        normalizedBucketName,
        normalizedObjectName,
      );
    } catch (error: unknown) {
      this.logger.error(
        `Failed to remove object ${normalizedBucketName}/${normalizedObjectName}`,
        error,
      );
      throw new InternalServerErrorException('File deletion failed');
    }
  }

  async statObject(
    bucketName: string,
    objectName: string,
  ): Promise<ObjectStatResult> {
    const normalizedBucketName = this.normalizeBucketName(bucketName);
    const normalizedObjectName = this.normalizeObjectName(objectName);

    try {
      const result = await this.minioClientService.statObject(
        normalizedBucketName,
        normalizedObjectName,
      );

      return {
        bucketName: normalizedBucketName,
        objectName: normalizedObjectName,
        etag: result.etag,
        lastModified: result.lastModified,
        size: result.size,
        metadata: result.metaData,
      };
    } catch (error: unknown) {
      this.logger.error(
        `Failed to stat object ${normalizedBucketName}/${normalizedObjectName}`,
        error,
      );
      throw new NotFoundException('Object not found');
    }
  }

  async getPresignedDownloadUrl(params: PresignedUrlParams): Promise<string> {
    const expiresInSeconds =
      params.expiresInSeconds ?? this.getDefaultPresignedUrlExpiresInSeconds();

    return this.minioClientService.getPresignedGetObjectUrl(
      this.normalizeBucketName(params.bucketName),
      this.normalizeObjectName(params.objectName),
      expiresInSeconds,
      params.requestDate,
    );
  }

  async getPresignedUploadUrl(params: PresignedUrlParams): Promise<string> {
    const expiresInSeconds =
      params.expiresInSeconds ?? this.getDefaultPresignedUrlExpiresInSeconds();

    return this.minioClientService.getPresignedPutObjectUrl(
      this.normalizeBucketName(params.bucketName),
      this.normalizeObjectName(params.objectName),
      expiresInSeconds,
    );
  }

  getPublicUrl(bucketName: string, objectName: string): string {
    const normalizedBucketName = this.normalizeBucketName(bucketName);

    if (
      !this.minioClientService.getPublicBuckets().includes(normalizedBucketName)
    ) {
      throw new NotFoundException(
        `Bucket ${normalizedBucketName} is not configured for public access`,
      );
    }

    const normalizedObjectName = this.normalizeObjectName(objectName);
    const encodedObjectName = normalizedObjectName
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');

    return `${this.minioClientService.getPublicBaseUrl()}/${normalizedBucketName}/${encodedObjectName}`;
  }

  private normalizeBucketName(bucketName: string): string {
    const normalizedBucketName = bucketName.trim();

    if (!normalizedBucketName) {
      throw new NotFoundException('Bucket name is required');
    }

    return normalizedBucketName;
  }

  private normalizeObjectName(objectName: string): string {
    const normalizedObjectName = objectName.trim().replace(/^\/+/, '');

    if (!normalizedObjectName) {
      throw new NotFoundException('Object name is required');
    }

    return normalizedObjectName;
  }

  private toMetadata(
    metadata?: Record<string, string>,
  ): ItemBucketMetadata | undefined {
    if (!metadata) {
      return undefined;
    }

    return Object.entries(metadata).reduce<ItemBucketMetadata>(
      (acc, [key, value]) => {
        acc[`x-amz-meta-${key}`] = value;
        return acc;
      },
      {},
    );
  }

  private getDefaultPresignedUrlExpiresInSeconds(): number {
    return this.configService.get<number>(
      'MINIO_PRESIGNED_URL_EXPIRES_IN_SECONDS',
      900,
    );
  }
}
