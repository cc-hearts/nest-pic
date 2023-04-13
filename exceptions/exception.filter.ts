import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common'
import { exceptionResponse } from '../typings'

@Catch()
export class ExceptionFilters implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): any {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse()
    const req = ctx.getRequest()
    let code: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
      message: Array<string> | string =
        typeof exception === 'object' && 'message' in exception
          ? (exception['message'] as string)
          : '请求失败'

    if (exception instanceof HttpException) {
      code = exception.getStatus()
      message = res.message || exception.message || '请求失败'
    }

    if (exception instanceof BadRequestException) {
      const response = exception.getResponse() as exceptionResponse
      if (typeof response === 'object') {
        message = response.message
      } else {
        message = response
      }
    }

    if (exception instanceof UnauthorizedException) {
      code = HttpStatus.UNAUTHORIZED
      message = exception.message
    }

    res.status(code).json({
      code,
      message,
      timestamp: new Date().toISOString(),
      path: req.path,
    })
  }
}
