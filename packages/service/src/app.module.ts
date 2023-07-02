import { Module } from '@nestjs/common'
import { GlobalModule } from './global.module'
import { UploadModule } from './upload/upload.module'
import { ContainerKeyModule } from './container-key/container-key.module'

import dataBaseProvider from '../provider/dataBase.provider'

@Module({
  imports: [
    ...dataBaseProvider,
    GlobalModule,
    UploadModule,
    ContainerKeyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
