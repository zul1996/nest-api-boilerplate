import { BadRequestException, ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Response } from 'express'; // <-- Tambahkan

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject('REDIS') private readonly redis: Redis,
  ) {}

  async login(dto: LoginUserDto, res: any): Promise<TokenResponseDto> {
    const user = await this.usersService.validateUser(
      dto.username,
      dto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });

    const sessionId = uuidv4();
    const refreshPayload = { sub: user.id, sessionId };

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    const refreshExpiry = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

    // Save refreshToken with sessionId
    const refreshExpirySeconds = this.getExpiryInSeconds(refreshExpiry);
    await this.redis.set(
      `refresh_token:${sessionId}`,
      user.id.toString(),
      'EX',
      refreshExpirySeconds,
    );

    // Set refresh token in HttpOnly Cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: refreshExpirySeconds * 1000, // ms
    });

    return { accessToken };
  }

  // async register(
  //   dto: CreateUserDto,
  //   res: Response,
  // ): Promise<{ accessToken: string }> {
  //   const existingUser = await this.usersService.findByUsername(dto.username);
  //   if (existingUser) {
  //     throw new ConflictException('Username already exists');
  //   }

  //   const hashedPassword = await bcrypt.hash(dto.password, 10);
  //   const newUser = await this.usersService.create({
  //     ...dto,
  //     password: hashedPassword,
  //   });

  //   const payload = { sub: newUser.id, username: newUser.username };

  //   const accessToken = await this.jwtService.signAsync(payload, {
  //     secret: process.env.JWT_ACCESS_SECRET,
  //     expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  //   });

  //   const refreshToken = await this.jwtService.signAsync(payload, {
  //     secret: process.env.JWT_REFRESH_SECRET,
  //     expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  //   });

  //   // Simpan RefreshToken di Redis
  //   await this.redis.set(
  //     `refresh:${newUser.id}`,
  //     refreshToken,
  //     'EX',
  //     7 * 24 * 60 * 60,
  //   );

  //   // Set RefreshToken di Cookie
  //   res.cookie('refresh_token', refreshToken, {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === 'production', // hanya https di production
  //     sameSite: 'strict',
  //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari dalam milidetik
  //     path: '/auth/refresh-token', // refresh token endpoint
  //   });

  //   return { accessToken };
  // }


  async refreshToken(
    sessionId: string,
    userId: number,
    res: any,
  ): Promise<TokenResponseDto> {
    const storedUserId = await this.redis.get(`refresh_token:${sessionId}`);
    if (!storedUserId || parseInt(storedUserId, 10) !== userId) {
      throw new UnauthorizedException('Invalid refresh session');
    }

    const payload = { sub: userId };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });

    // Rotate refresh token
    const newSessionId = uuidv4();
    const refreshPayload = { sub: userId, sessionId: newSessionId };

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    const refreshExpiry = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

    // Delete old session and create new session
    await this.redis.del(`refresh_token:${sessionId}`);
    const refreshExpirySeconds = this.getExpiryInSeconds(refreshExpiry);
    await this.redis.set(
      `refresh_token:${newSessionId}`,
      userId.toString(),
      'EX',
      refreshExpirySeconds,
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: refreshExpirySeconds * 1000,
    });

    return { accessToken };
  }

  async logout(sessionId: string, res: any): Promise<void> {
    await this.redis.del(`refresh_token:${sessionId}`);
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
  }

  private getExpiryInSeconds(expiry: string): number {
    // Example: '7d' → 7 * 24 * 60 * 60
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) throw new Error('Invalid expiry format');

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        throw new Error('Invalid expiry unit');
    }
  }
}
