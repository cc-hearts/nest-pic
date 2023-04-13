import { BasePaginationDto } from '../common/basePagination.dto'

export function definePagination<T extends BasePaginationDto>(params: T): T {
  const { pageSize = 10, pageNum = 1 } = params
  return {
    ...params,
    pageNum,
    pageSize,
  }
}

export function sumSkip<T extends BasePaginationDto>(params: T): number {
  const { pageSize, pageNum } = params
  return pageSize * (pageNum - 1)
}
