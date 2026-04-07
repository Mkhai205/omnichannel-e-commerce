import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { RequestLoggingInterceptor } from './core/interceptors/request-logging.interceptor';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { APP_CONFIG_KEY } from './core/config/env.constant';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const apiPrefix = 'api/v1';
  const docsPath = 'api/docs';

  app.setGlobalPrefix(apiPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(
    new RequestLoggingInterceptor(),
    new TransformInterceptor(),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const corsOriginRaw = configService.get<string>(
    'CORS_ORIGIN',
    APP_CONFIG_KEY.CORS_ORIGIN,
  );

  let corsOrigin: true | string[] = true;

  if (corsOriginRaw && corsOriginRaw.trim()) {
    const normalizedOrigin = corsOriginRaw.trim();

    if (normalizedOrigin !== '*') {
      try {
        const parsedOrigins = JSON.parse(normalizedOrigin) as unknown;

        if (Array.isArray(parsedOrigins)) {
          corsOrigin = parsedOrigins
            .map((item) => String(item).trim())
            .filter((item) => item.length > 0);
        }
      } catch {
        corsOrigin = normalizedOrigin
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
      }
    }
  }

  app.enableCors({
    credentials: true,
    origin: corsOrigin,
  });

  const appEnv = configService.get<string>('APP_ENV', APP_CONFIG_KEY.APP_ENV);
  const swaggerEnabled =
    configService.get<string>('SWAGGER_ENABLED') ??
    (appEnv === 'production' ? 'false' : 'true');
  const port = configService.get<number>('APP_PORT', APP_CONFIG_KEY.APP_PORT);

  if (swaggerEnabled === 'true') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Omnichannel E-commerce API')
      .setDescription('Internal API documentation for omnichannel platform')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        'bearer-auth',
      )
      .addCookieAuth(
        'ecommerce_access_token',
        {
          type: 'apiKey',
          in: 'cookie',
        },
        'cookie-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(docsPath, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  await app.listen(port);
  logger.log(`🚀 API listening on http://localhost:${port}`);

  if (swaggerEnabled === 'true') {
    logger.log(`📘 Swagger UI: http://$localhost:${port}/${docsPath}`);
  }
}
void bootstrap();
