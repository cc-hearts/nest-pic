import { Module } from '@nestjs/common';
import { PicController } from './pic.controller';
import { PicService } from './pic.service';

@Module({
  controllers: [PicController],
  providers: [PicService]
})
export class PicModule {}
