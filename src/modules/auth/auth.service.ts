import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from './tokens/token.service';
import { SessionService } from './sessions/session.service';
import { LoginUserDto } from './dto/login-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { Response, Request } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
  ) {}

  async login(dto: LoginUserDto, res: Response) {
    const user = await this.usersService.validateUser(
      dto.username,
      dto.password,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const accessPayload = { sub: user.id, username: user.username };
    const accessToken =
      await this.tokenService.generateAccessToken(accessPayload);

    const sessionId = uuidv4();
    const refreshPayload = { sub: user.id, sessionId };
    const refreshToken =
      await this.tokenService.generateRefreshToken(refreshPayload);

    const refreshTtl = this.getExpiryInSeconds(
      process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    );
    await this.sessionService.store(sessionId, user.id, refreshTtl);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: refreshTtl * 1000,
    });

    return { accessToken };
  }

  async refresh(req: Request, res: Response) {
    const { sub: userId, sessionId } = req.user as { sub: number; sessionId: string };

    await this.sessionService.validate(sessionId, userId);

    const accessToken = await this.tokenService.generateAccessToken({
      sub: userId,
    });

    const newSessionId = uuidv4();
    const newRefresh = await this.tokenService.generateRefreshToken({
      sub: userId,
      sessionId: newSessionId,
    });

    await this.sessionService.remove(sessionId);
    const ttl = this.getExpiryInSeconds(
      process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    );
    await this.sessionService.store(newSessionId, userId, ttl);

    res.cookie('refresh_token', newRefresh, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: ttl * 1000,
    });

    return { accessToken };
  }

  async logout(req: Request, res: Response) {
    const { sessionId } = req.user as { sessionId: string };
    await this.sessionService.remove(sessionId);
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
  }

  private getExpiryInSeconds(exp: string): number {
    const match = exp.match(/^(\d+)([smhd])$/);
    if (!match) throw new Error('Invalid expiry format');
    const val = parseInt(match[1], 10);
    switch (match[2]) {
      case 's':
        return val;
      case 'm':
        return val * 60;
      case 'h':
        return val * 3600;
      case 'd':
        return val * 86400;
      default:
        throw new Error('Invalid expiry unit');
    }
  }
}
