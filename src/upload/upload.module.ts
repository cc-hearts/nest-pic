import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { ContainerKeyModule } from 'src/container-key/container-key.module';

@Module({
  imports: [ContainerKeyModule],
  providers: [UploadService],
  controllers: [UploadController]
})
export class UploadModule { }
