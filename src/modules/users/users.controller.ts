import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Res,
  HttpCode,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './entities/user.entity';
import {
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger'; // Updated decorators
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiBody({ type: CreateUserDto })
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {

    console.log('===> Incoming DTO (from client):', createUserDto);

    const { accessToken, refreshToken, user } =
      await this.usersService.registerUser(createUserDto);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password, ...userSafe } = user;

    return {
      status: 'SUCCESS',
      user: userSafe,
      jwtToken: accessToken,
    };
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by username' })
  async getUserByUsername(@Param('username') username: string): Promise<Users> {
    return this.usersService.findByUsername(username);
  }

  @Post(':username/update')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateUserDto })
  async updateUser(
    @Param('username') username: string,
    @Body() updateUserDto: CreateUserDto,
  ): Promise<Users> {
    return this.usersService.update(username, updateUserDto);
  }
}
