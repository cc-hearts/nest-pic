import { IBaseResponse } from '../typings'
import { HttpStatus } from '@nestjs/common'

export class BaseResponse<T> implements IBaseResponse<T> {
  constructor(
    public data: T,
    public message = '请求成功',
    public code = HttpStatus.OK
  ) {}
}
