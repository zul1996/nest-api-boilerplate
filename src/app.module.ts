import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { redisConfig } from './config/redis.config';
import Redis from 'ioredis'; // Correct import of Redis client

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
  providers: [
    {
      provide: 'REDIS',
      useFactory: () => {
        // Create a Redis client instance using the config
        return new Redis(redisConfig); // Instantiate with the configuration
      },
    },
  ],
})
export class AppModule {}
