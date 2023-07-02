import { Module } from '@nestjs/common'
import { UploadService } from './upload.service'
import { UploadController } from './upload.controller'
import { ContainerKeyModule } from 'src/container-key/container-key.module'
import { UploadProvider } from './upload.provider'
@Module({
  imports: [ContainerKeyModule],
  providers: [UploadService, ...UploadProvider],
  controllers: [UploadController],
})
export class UploadModule {}
