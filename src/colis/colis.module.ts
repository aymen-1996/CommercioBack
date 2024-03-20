import { Module } from '@nestjs/common';
import { ColisService } from './colis.service';
import { ColisController } from './colis.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Colis } from './colis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Colis])],
  providers: [ColisService],
  controllers: [ColisController],
  exports: [TypeOrmModule],
})
export class ColisModule {}
