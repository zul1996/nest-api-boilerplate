import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { Response, Request } from 'express';
import { ApiTags, ApiCookieAuth, ApiOkResponse, ApiCreatedResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SecUserAndRoleDto } from './dto/sec-user-role.dto';
import { LoginRespDto } from './dto/login-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@CurrentUser() user: SecUserAndRoleDto) {
    return {
      status: 'SUCCESS',
      data: user,
    };
  }

  @Post('login')
  @ApiBody({ type: LoginUserDto })
  async login(@Body() dto: LoginUserDto, @Res() res: Response): Promise<void> {
    const { loginResp, refreshToken, refreshTtl } =
      await this.authService.login(dto);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: refreshTtl * 1000,
    });

    res.json(loginResp);
  }

  @UseGuards(RefreshTokenGuard)
  @ApiCookieAuth('refresh_token')
  @Post('refresh')
  async refresh(
    @CurrentUser() user: { sub: string; sessionId: string },
    @Res() res: Response,
  ): Promise<LoginRespDto> {
    return this.authService.refresh(user, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.logout(req, res);
    return res.json({ message: 'Logged out' });
  }
}
