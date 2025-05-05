import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule,JwtModule.register({})], // Config via signAsync
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
