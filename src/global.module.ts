import { Global, Module } from '@nestjs/common'
import { RedisService } from '../provider/redis.provider'

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class GlobalModule { }
