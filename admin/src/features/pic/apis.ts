import type { IPage, ITableResponse } from '@/typings'
import { Get } from '@/utils'
const prefix = 'container-key'

export function getPicList<T extends IPage>(params: T) {
  const { data } = Get<ITableResponse>(`/${prefix}/getPicList`, params)
  return data
}

const uploadPrefix = 'upload'
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
