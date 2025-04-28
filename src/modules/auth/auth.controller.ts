import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginUserDto, @Res() res: Response) {
    const tokens = await this.authService.login(loginDto, res);
    return res.json(tokens);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(
    @GetCurrentUser('userId') userId: number,
    @GetCurrentUser('sessionId') sessionId: string,
    @Res() res: Response,
  ) {
    const tokens = await this.authService.refreshToken(sessionId, userId, res);
    return res.json(tokens);
  }

  // @Post('register')
  // async register(
  //   @Body() dto: CreateUserDto,
  //   @Res() res: Response, // Gunakan @Res() di sini
  // ) {
  //   return this.authService.register(dto, res); // Pastikan res diteruskan ke service
  // }

  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  async logout(
    @GetCurrentUser('sessionId') sessionId: string,
    @Res() res: Response,
  ) {
    await this.authService.logout(sessionId, res);
    return res.json({ message: 'Logged out' });
  }
}
