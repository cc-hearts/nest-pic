import type { IPage, ITableResponse } from '@/typings'
import { Get, Post } from '@/utils'
const prefix = 'container-key'
const uploadPrefix = 'upload'

export function getPicList<T extends IPage>(params: T) {
  const { data } = Get<ITableResponse>(`/${prefix}/getPicList`, params)
  return data
}

export function getUploadFileList<T extends IPage & { namespace: string }>(
  params: T
) {
  const { namespace, ...pagination } = params
  const { data } = Get<ITableResponse>(
    `/${uploadPrefix}/getUploadFileList/${namespace}`,
    pagination
  )
  return data
}

export function getFileListByPath(path: string) {
  const { data } = Post(`/${uploadPrefix}/getFileListByPath`, { path })
  return data
}
