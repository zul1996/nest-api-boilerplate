import { Global, Module } from "@nestjs/common";
import { redisConfig } from "src/config/redis.config";

@Global()
@Module({
    providers: [
        {
            provide: 'REDIS',
            useFactory: () => {
                const Redis = require('ioredis');
                return new Redis({redisConfig});
            },
        },
    ],
    exports: ['REDIS'],
})

export class RedisModule {}