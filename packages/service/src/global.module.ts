import { Global, Module } from '@nestjs/common'
import { containerKeyProvider } from './container-key/container-key.provider'

@Global()
@Module({
  providers: [...containerKeyProvider],
  exports: [...containerKeyProvider],
})
export class GlobalModule {}
