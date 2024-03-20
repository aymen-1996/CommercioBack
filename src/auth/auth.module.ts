/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { User } from "../user/user.entity";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  
  ],  
    providers: [AuthService],
    controllers: [AuthController],
    exports:[AuthService],
})
export class AuthModule {}
