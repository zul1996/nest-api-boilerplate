import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { TokenService } from './tokens/token.service';
import { SessionService } from './sessions/session.service';
import { LoginUserDto } from './dto/login-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { Response, Request } from 'express';
import { UsersService } from '../users/users.service';
import { plainToInstance } from 'class-transformer';
import { SecUserAndRoleDto } from './dto/sec-user-role.dto';
import { LoginRespDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
  ) {}

  async login(
    dto: LoginUserDto,
  ): Promise<{
    loginResp: LoginRespDto;
    refreshToken: string;
    refreshTtl: number;
  }> {
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

    const userDto = plainToInstance(SecUserAndRoleDto, {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.roleUser,
      isActive: user.isActive,
      mustChangePasswordFlag: user.mustChangePasswordFlag,
      lastLoginSuccessTs: user.lastLoginSuccessTs,
      lastChangePasswordTs: user.lastChangePasswordTs,
    });

    const loginResp: LoginRespDto = {
      sessionId,
      status: 'SUCCESS',
      user: userDto,
      warningMessage: '',
      orgUser: undefined,
      impersonateFlag: false,
      jwtToken: accessToken,
      menu: null,
    };

    return { loginResp, refreshToken, refreshTtl };
  }

  async refresh(
    user: { sub: string; sessionId: string },
    res: Response,
  ): Promise<LoginRespDto> {
    const { sub: userId, sessionId } = user;

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

    // Bisa ambil user dari service kalau ingin lengkap response, sementara null dulu:
    return {
      sessionId: newSessionId,
      status: 'SUCCESS',
      warningMessage: null,
      user: null, // nanti diisi user info kalau perlu
      orgUser: null, // impersonate juga null dulu
      impersonateFlag: false,
      availableImpersonates: null,
      jwtToken: accessToken,
      menu: null,
    };
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.user as { sessionId: string };

      if (!sessionId) {
        throw new UnauthorizedException('Invalid session');
      }

      await this.sessionService.remove(sessionId);

      res.clearCookie('refresh_token', {
        path: '/auth/refresh',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Logged out successfully',
      });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to logout');
    }
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
