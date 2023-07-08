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
