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
import { User } from './entities/user.entity';
import { ApiResponse, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger'; // Updated decorators
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered and access token returned',
    schema: {
      example: {
        accessToken: 'access_token_example',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Username already exists',
  })
  async register(@Body() dto: CreateUserDto, @Res() res: Response) {
    const existingUser = await this.usersService.findByUsername(dto.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const { accessToken, refreshToken } =
      await this.usersService.registerUser(dto);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/user/refresh-token',
    });

    return { accessToken };
  }

  @Get(':username')
  @ApiOperation({ summary: 'Get user by username' })
  @ApiParam({
    name: 'username',
    type: String,
    description: 'Username of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.findByUsername(username);
  }

  @Post(':username/update')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user information' })
  @ApiParam({
    name: 'username',
    type: String,
    description: 'Username of the user to update',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User information updated successfully',
    type: User,
  })
  async updateUser(
    @Param('username') username: string,
    @Body() updateUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.update(username, updateUserDto);
  }
}
