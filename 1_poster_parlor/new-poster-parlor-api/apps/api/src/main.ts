/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AppLogger } from '@new-poster-parlor-api/logger';
import { AppConfigService } from '@new-poster-parlor-api/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Logger configuration
  const logger = app.get(AppLogger);
  logger.setContext("Bootstrap");
  app.useLogger(logger);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const config = app.get(AppConfigService);

  const port = config.appConfig.port || 3000;
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
