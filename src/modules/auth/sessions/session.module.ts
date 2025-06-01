// session.module.ts

import { Module } from "@nestjs/common";
import { SessionDBService } from "./sessionDB.service";
import { SessionRedisService } from "./sessionRedis.service";

@Module({
  providers: [
    SessionRedisService,
    SessionDBService,
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
