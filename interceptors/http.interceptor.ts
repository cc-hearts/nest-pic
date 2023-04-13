import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { map, Observable } from 'rxjs'
import type { IBaseResponse } from '../typings'

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<any> | Promise<Observable<IBaseResponse<any>>> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest()
    const { path } = request.route
    const timeStamp = new Date().toISOString()
    return next.handle().pipe(
      map((data) => {
        let code = 200,
          message = '请求成功'
        if (typeof data === 'object' && data !== null) {
          code = data.code ?? code
          message = data.message ?? message
          data = data.data || data || null
        }
        return {
          data,
          code,
          message,
          path,
          timeStamp,
        }
      })
    )
  }
}
