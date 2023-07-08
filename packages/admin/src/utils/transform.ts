import type { IPage } from '@/typings'

export function transformPaginationParams<T extends IPage>(params: T) {
  return {
    pageNum: params.page,
    pageSize: params.pageSize,
  }
}

export type transformPaginationParamsType<T extends IPage> = Omit<T, 'page'> &
  Record<'pageNum', T['page']>
