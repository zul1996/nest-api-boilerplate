import * as dotenv from 'dotenv';
import { RedisOptions } from 'ioredis';


dotenv.config;

export const redisConfig: RedisOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
};

