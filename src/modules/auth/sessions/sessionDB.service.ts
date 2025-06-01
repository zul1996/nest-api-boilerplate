import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'; // nanti kita buat entity ini
import { MoreThan } from 'typeorm';
import { SessionEntity } from 'src/common/entities/session.entity';
import { ISessionService } from 'src/common/interface/isession.interface';

@Injectable()
export class SessionDBService implements ISessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepo: Repository<SessionEntity>,
  ) {}

  async store(
    sessionId: string,
    userId: string,
    ttlSeconds: number,
  ): Promise<void> {
    const now = new Date();
    const expiredAt = new Date(now.getTime() + ttlSeconds * 1000);

    const session = this.sessionRepo.create({
      sessionId,
      userId,
      createdAt: now,
      expiredAt,
    });

    await this.sessionRepo.save(session);
  }

  async validate(sessionId: string, userId: string): Promise<void> {
    const now = new Date();

    const session = await this.sessionRepo.findOne({
      where: {
        sessionId,
        userId,
        expiredAt: MoreThan(now), // expiredAt > now
      },
    });

    if (!session) {
      throw new UnauthorizedException('Invalid or expired refresh session');
    }
  }

  async remove(sessionId: string): Promise<void> {
    await this.sessionRepo.delete({ sessionId });
  }
}
