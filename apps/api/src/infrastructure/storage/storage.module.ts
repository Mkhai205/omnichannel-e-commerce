import { Global, Module } from '@nestjs/common';
import { MinioClientService } from './minio.client';
import { StorageService } from './storage.service';

@Global()
@Module({
  providers: [MinioClientService, StorageService],
  exports: [StorageService],
})
export class StorageModule {}
