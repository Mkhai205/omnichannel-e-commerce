import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPrismaAdapter, PrismaClient } from '@repo/database';

const DATABASE_CONFIG = {
  DEFAULT_POOL_MIN: 2,
  DEFAULT_POOL_MAX: 10,
  DEFAULT_TIMEOUT: 30000,
  DEFAULT_RETRY_ATTEMPTS: 5,
  DEFAULT_RETRY_DELAY: 2000,
} as const;

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: ConfigService) {
    const nodeEnv = configService.get<string>('NODE_ENV', 'development');

    const adapter = createPrismaAdapter({
      connectionString: configService.get<string>('DATABASE_URL')!,
      max:
        configService.get<number>('DATABASE_POOL_MAX') ||
        DATABASE_CONFIG.DEFAULT_POOL_MAX,
      min:
        configService.get<number>('DATABASE_POOL_MIN') ||
        DATABASE_CONFIG.DEFAULT_POOL_MIN,
      connectionTimeoutMillis:
        configService.get<number>('DATABASE_CONNECTION_TIMEOUT') ||
        DATABASE_CONFIG.DEFAULT_TIMEOUT,
    });

    super({
      adapter,
      log:
        nodeEnv === 'development'
          ? [
              { emit: 'stdout', level: 'error' },
              { emit: 'stdout', level: 'warn' },
              { emit: 'stdout', level: 'info' },
            ]
          : [
              { emit: 'stdout', level: 'error' },
              { emit: 'stdout', level: 'warn' },
            ],
      errorFormat: 'pretty',
    });
  }

  /**
   * Lifecycle hook: Connect to database when module initializes.
   */
  async onModuleInit(): Promise<void> {
    await this.connectWithRetry();
  }

  /**
   * Lifecycle hook: Disconnect database when application shuts down.
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Disconnected from PostgreSQL database');
  }

  /**
   * Connect to database with retry logic.
   */
  private async connectWithRetry(): Promise<void> {
    const maxAttempts = DATABASE_CONFIG.DEFAULT_RETRY_ATTEMPTS;
    const retryDelay = DATABASE_CONFIG.DEFAULT_RETRY_DELAY;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.$connect();
        this.logger.log('👌 Connected to PostgreSQL database via Prisma');
        return;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        this.logger.warn(
          `🤌 Prisma connect attempt ${attempt}/${maxAttempts} failed: ${errorMessage}`,
        );

        if (attempt >= maxAttempts) {
          this.logger.error(
            `👎 Unable to connect to database after ${maxAttempts} attempts`,
          );
          throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }
}
