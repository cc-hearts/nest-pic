import { reactive } from 'vue'
import type { IPage, IPaginationParams } from '@/typings'
import type { fn } from '@cc-heart/utils/helper'
export function usePagination(
  pagination: IPage | object = {},
  params: IPaginationParams = {}
) {
  const paginationReactive = reactive<
    {
      pagination: IPage
    } & IPaginationParams
  >({
    pagination: {
      page: 1,
      pageSize: 10,
      ...pagination,
    },
    itemCount: 0,
    ...params,
  })

  function setCurrent(page: number, callback?: fn) {
    paginationReactive.pagination.page = page
    callback instanceof Function && callback()
  }

  function _sizeChange(cb?: fn) {
    return function (pageSize: number) {
      paginationReactive.pagination.pageSize = pageSize
      setCurrent(1, cb)
    }
  }

  function _currentChange(cb?: fn) {
    return function (page: number) {
      setCurrent(page, cb)
    }
  }

  return {
    paginationReactive,
    _sizeChange,
    _currentChange,
  }
}
