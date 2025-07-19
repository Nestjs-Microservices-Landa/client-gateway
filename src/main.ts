import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RcpCustomExceptionFilter } from './common/exceptions/rcp-custom-exception.filter';

async function bootstrap() {
  const logger = new Logger('Main-Gateway');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new RcpCustomExceptionFilter());
  await app.listen(envs.port ?? 3000);
  logger.log(`Gateway running on port ${envs.port}`);
}
bootstrap();
