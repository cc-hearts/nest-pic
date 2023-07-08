import type { IPage, ITableResponse } from '@/typings'
import { Delete, Get, Post, Put } from '@/utils'
import { transformPaginationParamsType } from '@/utils/transform'
import { INamespaceColumn } from './types'
const prefix = 'container-key'
const uploadPrefix = 'upload'

export function getPicList<T extends transformPaginationParamsType<IPage>>(
  params: T
) {
  const { data } = Get<ITableResponse<Array<INamespaceColumn>>>(
    `/${prefix}/getPicList`,
    params
  )
  return data
}

export function getUploadFileList<
  T extends transformPaginationParamsType<IPage> & { namespace: string }
>(params: T) {
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

export function addNamespace(name: string) {
  const { data } = Post(`/${prefix}/addNamespace`, { name })
  return data
}
export function updateNamespace(id: number, name: string) {
  const { data } = Put(`/${prefix}/updateNamespace`, { name, id })
  return data
}

export function genNamespaceApi() {
  const { data } = Post(`/${prefix}/genKey`)
  return data
}

export function removeNamespace(id: number) {
  const { data } = Delete(`/${prefix}/removeNamespace/${id}`)
  return data
}
