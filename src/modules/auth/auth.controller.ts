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
import { ApiTags, ApiCookieAuth, ApiOkResponse, ApiCreatedResponse, ApiBody } from '@nestjs/swagger';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return { message: 'User profile data', user };
  }

  @Post('login')
  @ApiBody({ type: LoginUserDto })
  async login(@Body() dto: LoginUserDto, @Res() res: Response) {
    await this.authService.login(dto, res);
  }

  @UseGuards(RefreshTokenGuard)
  @ApiCookieAuth('refresh_token')
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.refresh(req, res);
    return res.json(result);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.logout(req, res);
    return res.json({ message: 'Logged out' });
  }
}
