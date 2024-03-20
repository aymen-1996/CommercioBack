/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ColisModule } from './colis/colis.module';
import { Colis } from './colis/colis.entity';
import { ColisController } from './colis/colis.controller';
import { ColisService } from './colis/colis.service';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SavebagModule } from './savebag/savebag.module';
import { SB } from './savebag/sb.entity';
import { SavebagController } from './savebag/savebag.controller';
import { SavebagService } from './savebag/savebag.service';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'ChiffreDaffaire2024',
    entities: [Colis , User , SB],
    synchronize: true,
  }),
    ColisModule,
  UserModule,
  AuthModule,
  SavebagModule
  ],
  controllers: [AppController,ColisController,SavebagController],
  providers: [AppService,ColisService,SavebagService],
})
export class AppModule {}
