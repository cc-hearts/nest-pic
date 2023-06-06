import { reactive } from "vue"
import type { IPage, IPaginationParams } from "@/typings"
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
      pageNum: 1,
      pageSize: 10,
      ...pagination,
    },
    total: 0,
    ...params,
  })

  function setCurrent(pageNum: number, callback?: fn) {
    paginationReactive.pagination.pageNum = pageNum
    callback instanceof Function && callback()
  }

  function _sizeChange(cb?: fn) {
    return function (pageSize: number) {
      paginationReactive.pagination.pageSize = pageSize
      setCurrent(1, cb)
    }
  }

  function _currentChange(cb?: fn) {
    return function (pageNum: number) {
      setCurrent(pageNum, cb)
    }
  }

  return {
    paginationReactive,
    _sizeChange,
    _currentChange,
  }
}