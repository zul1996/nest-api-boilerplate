import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../tokens/token.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.cookies['refresh_token'];
    if (!token) throw new UnauthorizedException('Refresh token not found');

    try {
      const decoded = await this.tokenService.verifyRefreshToken(token);
      req.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
