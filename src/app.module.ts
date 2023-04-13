import { Module } from '@nestjs/common'
import { GlobalModule } from './global.module'
import dataBaseProvider from 'provider/dataBase.provider'

@Module({
  imports: [
    ...dataBaseProvider,
    GlobalModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
