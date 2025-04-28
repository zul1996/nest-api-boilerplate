import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: (req: Request) => {
        const token = req.cookies['refresh_token']; // Extract token from cookies
        if (!token) {
          throw new Error('Refresh token not found');
        }
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET || '', // Ensure secret is set
    });
  }

  async validate(payload: any) {
    // You can add additional validation for the payload if needed
    return { userId: payload.sub, sessionId: payload.sessionId };
  }
}
