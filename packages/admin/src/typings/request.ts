import { fn } from '@cc-heart/utils/helper'
import { ITableResponse } from './ui'

export interface IBaseResponse<T = any> {
  code: number
  message: string
  data?: T
  path?: string
  timestamp?: string
}

export interface IPage {
  page: number
  pageSize: number
}

export interface IPaginationParams {
  itemCount?: number
}

export type TransverseIDataSource<T extends fn> = ReturnType<T> extends Promise<
  IBaseResponse<ITableResponse<infer r>>
>
  ? r
  : never
