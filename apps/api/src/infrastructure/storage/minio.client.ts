import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import type { Readable } from 'node:stream';
import type { BucketItemStat, ItemBucketMetadata } from 'minio';

interface MinioClientConfig {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  region: string;
  buckets: string[];
  publicBuckets: string[];
}

@Injectable()
export class MinioClientService implements OnModuleInit {
  private readonly logger = new Logger(MinioClientService.name);
  private readonly client: Client;
  private readonly config: MinioClientConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = this.getConfig();
    this.client = new Client({
      endPoint: this.config.endPoint,
      port: this.config.port,
      useSSL: this.config.useSSL,
      accessKey: this.config.accessKey,
      secretKey: this.config.secretKey,
      region: this.config.region,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.ping();
    await this.ensureBuckets();
    this.logger.log('🌚 MinIO storage initialized');
  }

  async ping(): Promise<void> {
    try {
      await this.client.listBuckets();
    } catch (error: unknown) {
      this.logger.error('🤌 Unable to connect to MinIO', error);
      throw new InternalServerErrorException(
        'Unable to connect to MinIO storage',
      );
    }
  }

  async uploadObject(
    bucketName: string,
    objectName: string,
    data: Buffer | string | Readable,
    size?: number,
    metadata?: ItemBucketMetadata,
  ): Promise<{ etag: string; versionId?: string | null }> {
    return this.client.putObject(bucketName, objectName, data, size, metadata);
  }

  async removeObject(bucketName: string, objectName: string): Promise<void> {
    await this.client.removeObject(bucketName, objectName);
  }

  async statObject(
    bucketName: string,
    objectName: string,
  ): Promise<BucketItemStat> {
    return this.client.statObject(bucketName, objectName);
  }

  async getPresignedGetObjectUrl(
    bucketName: string,
    objectName: string,
    expiresInSeconds: number,
    requestDate?: Date,
  ): Promise<string> {
    return this.client.presignedGetObject(
      bucketName,
      objectName,
      expiresInSeconds,
      requestDate,
    );
  }

  async getPresignedPutObjectUrl(
    bucketName: string,
    objectName: string,
    expiresInSeconds: number,
  ): Promise<string> {
    return this.client.presignedPutObject(
      bucketName,
      objectName,
      expiresInSeconds,
    );
  }

  getPublicBuckets(): string[] {
    return this.config.publicBuckets;
  }

  getPublicBaseUrl(): string {
    const protocol = this.config.useSSL ? 'https' : 'http';
    const endpointWithPort = `${this.config.endPoint}:${this.config.port}`;

    return `${protocol}://${endpointWithPort}`;
  }

  private async ensureBuckets(): Promise<void> {
    for (const bucketName of this.config.buckets) {
      const bucketExists = await this.client.bucketExists(bucketName);

      if (!bucketExists) {
        await this.client.makeBucket(bucketName, this.config.region);
        this.logger.log(`👍 Created bucket: ${bucketName}`);
      } else {
        this.logger.log(`✅ Bucket already exists: ${bucketName}`);
      }

      if (this.config.publicBuckets.includes(bucketName)) {
        await this.setBucketPublic(bucketName);
      }
    }
  }

  private async setBucketPublic(bucketName: string): Promise<void> {
    const publicReadPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: ['s3:GetObject'],
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };

    await this.client.setBucketPolicy(
      bucketName,
      JSON.stringify(publicReadPolicy),
    );
  }

  private getConfig(): MinioClientConfig {
    const endPoint = this.configService.get<string>('MINIO_ENDPOINT');
    const port = this.configService.get<number>('MINIO_PORT');
    const useSSL = this.configService.get<boolean>('MINIO_SECURE');
    const accessKey = this.configService.get<string>('MINIO_ROOT_USER');
    const secretKey = this.configService.get<string>('MINIO_ROOT_PASSWORD');
    const region = this.configService.get<string>('MINIO_REGION', 'us-east-1');
    const buckets = this.toList(
      this.configService.get<string>('MINIO_BUCKETS'),
    );
    const publicBuckets = this.toList(
      this.configService.get<string>('MINIO_PUBLIC_BUCKETS'),
    );

    if (
      !endPoint ||
      !port ||
      useSSL === undefined ||
      !accessKey ||
      !secretKey
    ) {
      throw new Error('MinIO configuration is invalid');
    }

    if (buckets.length === 0) {
      throw new Error('At least one MinIO bucket must be configured');
    }

    return {
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
      region,
      buckets,
      publicBuckets,
    };
  }

  private toList(value: string | undefined): string[] {
    if (!value) {
      return [];
    }

    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
}
