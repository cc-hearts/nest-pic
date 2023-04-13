import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { RedisService } from '../provider/redis.provider'
import { decrypt } from '../utils/crypto'
import { isExistWhitePath } from '../decorators/whitePath'
import {
  EMPTY_TOKEN,
  EXPIRED_TOKEN,
  ROUTER_UNAUTHORIZE,
} from 'constants/message'
import { validateRoute } from 'utils/validateRoute'
import type { cb } from '../typings'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly redisService: RedisService) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    return new Promise((resolve, reject) => {
      const func = context.getHandler() as cb
      // 白名单过滤
      if (isExistWhitePath(func)) {
        resolve(true)
        return
      }
      const request = context.switchToHttp().getRequest()
      let token: string = request.headers['authorization']?.split(' ')[1]

      if (!token) {
        throw new UnauthorizedException(EMPTY_TOKEN)
      }

      token = decrypt(token).split('/')[1]
      this.redisService.get(token).then((user) => {
        const isExist = !!user
        if (!isExist) reject(new UnauthorizedException(EXPIRED_TOKEN))
        if (typeof user === 'string') {
          request.user = JSON.parse(user)
        }
        // const ctor = Reflect.get(context, 'constructorRef')
        const { path, stack } = request.route
        const [{ method }] = stack
        // 判断路由权限
        const bool = validateRoute(path, method, request.user)
        if (!bool) {
          reject(new ForbiddenException(ROUTER_UNAUTHORIZE))
        }
        resolve(bool)
      })
    })
  }
}
