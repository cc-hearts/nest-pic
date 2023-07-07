import { Module } from '@nestjs/common'
import { GlobalModule } from './global.module'
import { UploadModule } from './upload/upload.module'
import { ContainerKeyModule } from './container-key/container-key.module'
import { JwtModule } from '@nestjs/jwt'
import dataBaseProvider from '../provider/dataBase.provider'
import { getConfig } from '../utils'
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: getConfig().secret,
      signOptions: { expiresIn: '-1s' },
    }),
    ...dataBaseProvider,
    GlobalModule,
    UploadModule,
    ContainerKeyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
