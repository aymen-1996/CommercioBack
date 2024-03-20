import { Module } from '@nestjs/common';
import { SavebagService } from './savebag.service';
import { SavebagController } from './savebag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SB } from './sb.entity';
import { Colis } from 'src/colis/colis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SB,Colis])],
  providers: [SavebagService],
  controllers: [SavebagController],
  exports: [TypeOrmModule],
})
export class SavebagModule {}
