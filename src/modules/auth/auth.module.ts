import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { RedisModule } from "src/common/redis/redis.module";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";


@Module({
    imports: [
        UsersModule,RedisModule
    ],
    providers: [
        AuthService, JwtService
    ],
    controllers: [
        AuthController
    ],
})

export class AuthModule {}