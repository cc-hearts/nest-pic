export interface IBaseResponse<T = any> {
  code: number
  message: string
  data?: T
  path?: string
  timestamp?: string
}

export interface IPage {
  pageNum: number
  pageSize: number
}

export interface IPaginationParams {
  total?: number
}

