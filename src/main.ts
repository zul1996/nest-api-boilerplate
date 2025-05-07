import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  await app.use(cookieParser());

  app.useGlobalInterceptors(new AuditInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  setupSwagger(app);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
