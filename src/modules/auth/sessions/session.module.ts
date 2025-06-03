import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from 'src/common/entities/session.entity';
import { SessionDBService } from './sessionDB.service';
import { SessionRedisService } from './sessionRedis.service';
import { Module } from '@nestjs/common';
import { RedisModule } from 'src/infra/redis/redis.module';

console.log('SESSION_BACKEND env:', process.env.SESSION_BACKEND);

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity]),
    ...(process.env.SESSION_BACKEND !== 'db' ? [RedisModule] : []),
  ],
  providers: [
    ...(process.env.SESSION_BACKEND === 'db'
      ? [SessionDBService]
      : [SessionRedisService]),
    {
      provide: 'ISessionService',
      useClass:
        process.env.SESSION_BACKEND === 'db'
          ? SessionDBService
          : SessionRedisService,
    },
  ],
  exports: ['ISessionService'],
})
export class SessionModule {}
