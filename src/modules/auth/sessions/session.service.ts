import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class SessionService {
  constructor(@Inject('REDIS') private readonly redis: Redis) {}

  async store(
    sessionId: string,
    userId: string,
    ttlSeconds: number,
  ): Promise<void> {
    await this.redis.set(
      `refresh_token:${sessionId}`,
      userId,
      'EX',
      ttlSeconds,
    );
  }

  async validate(sessionId: string, userId: string): Promise<void> {
    const storedUserId = await this.redis.get(`refresh_token:${sessionId}`);

    if (!storedUserId || storedUserId !== userId) {
      throw new UnauthorizedException('Invalid refresh session');
    }
  }

  async remove(sessionId: string): Promise<void> {
    await this.redis.del(`refresh_token:${sessionId}`);
  }
}
