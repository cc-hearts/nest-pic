import { Request } from '@cc-heart/utils-client'
import type { params } from '@cc-heart/utils-client/dist/types/src/utils/request'
import type { IBaseResponse } from '@/typings'
import { router } from '@/modules/router'
import { getToken, errorMsg, clearToken } from '.'
import { baseUrl, prefix } from '@/configs'

const request = new Request<IBaseResponse>([baseUrl, prefix].join('/'))

request.useResponseInterceptor((data) => {
  const { code, message } = data
  if ([200].includes(code)) {
    return Promise.resolve(data)
  }
  if ([401].includes(code)) {
    clearToken()
    router.push('/login')
  }
  return Promise.reject(message)
})

request.useErrorInterceptor((error) => {
  errorMsg(error.toString())
  return Promise.reject(error)
})

request.useRequestInterceptor((config) => {
  const token = getToken()
  if (!config.headers) {
    config.headers = {}
  }
  if (token) config.headers['Authorization'] = `Bearer ${token}`
})

export default request

export function Get<T, U extends params = params>(
  url: string,
  params?: U,
  requestInit?: RequestInit
) {
  return request.Get<IBaseResponse<T>>(url, params, requestInit)
}

export function Post<T, U extends params = params>(
  url: string,
  params?: U,
  requestInit?: RequestInit
) {
  return request.Post<IBaseResponse<T>>(url, params, requestInit)
}

export function Put<T, U extends params = params>(
  url: string,
  params?: U,
  requestInit?: RequestInit
) {
  return request.Put<IBaseResponse<T>>(url, params, requestInit)
}

export function Delete<T, U extends params = params>(
  url: string,
  params?: U,
  requestInit?: RequestInit
) {
  return request.Delete<IBaseResponse<T>>(url, params, requestInit)
}