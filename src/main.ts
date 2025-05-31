import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
// import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  await app.use(cookieParser());

  // app.useGlobalInterceptors(new AuditInterceptor());

  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }), 
  );

  setupSwagger(app);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
