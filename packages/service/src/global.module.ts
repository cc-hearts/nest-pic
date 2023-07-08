import { Global, Module } from '@nestjs/common'
import { containerKeyProvider } from './container-key/container-key.provider'
import { JwtService } from '@nestjs/jwt'

@Global()
@Module({
  providers: [...containerKeyProvider, JwtService],
  exports: [...containerKeyProvider, JwtService],
})
export class GlobalModule {}
