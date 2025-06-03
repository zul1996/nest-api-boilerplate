import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { RedisModule } from './infra/redis/redis.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { SessionModule } from './modules/auth/sessions/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // default sudah ini, bisa diubah jika perlu
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ...(process.env.SESSION_BACKEND !== 'db' ? [RedisModule] : []), // <-- pakai spread operator
    UsersModule,
    AuthModule,
    ProductModule,
    SessionModule,
  ],
})
export class AppModule {}
