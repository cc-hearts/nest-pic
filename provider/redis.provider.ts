import { Injectable } from '@nestjs/common'
import Redis, { ClientContext, Result } from 'ioredis'
import { getConfig, isObject } from '../utils'

type redisVal = string | Buffer | number

@Injectable()
export class RedisService {
  private redisInstance: Redis

  onModuleInit() {
    if (!this.redisInstance) {
      this.createInstance()
    }
  }

  createInstance() {
    const { redis: redisConfig } = getConfig()
    this.redisInstance = new Redis(redisConfig)
  }

  public async set(
    key: string,
    value: redisVal
  ): Promise<Result<'OK', ClientContext>>
  public async set(
    key: string,
    value: redisVal,
    seconds: number
  ): Promise<Result<'OK', ClientContext>>
  public async set(
    key: string,
    value: redisVal,
    seconds?: number
  ): Promise<Result<'OK', ClientContext> | null> {
    try {
      const val = isObject(value) ? JSON.stringify(value) : value
      if (seconds) {
        return this.redisInstance.set(key, val, 'EX', seconds)
      } else {
        return this.redisInstance.set(key, val)
      }
    } catch (e) {
      console.log('redis error set value', e)
      return null
    }
  }

  public async get(key: string): Promise<Result<string | null, ClientContext>> {
    return this.redisInstance.get(key)
  }

  public async del(key: string): Promise<Result<number, ClientContext>> {
    return this.redisInstance.del(key)
  }

  public async has(key: string): Promise<boolean> {
    return (await this.redisInstance.get(key)) === null
  }
}
