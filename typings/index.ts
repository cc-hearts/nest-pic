import { HttpStatus } from '@nestjs/common'

export interface IBaseResponse<T> {
  message?: string
  code?: HttpStatus
  data?: T
  path?: string
  timestamp?: string
}

export type cb = (...args: any[]) => any

export interface exceptionResponse {
  statusCode: HttpStatus

  message: Array<string> | string
  error: string
}

export interface IUserInfo {
  id: number
  // TODO: user info
}
