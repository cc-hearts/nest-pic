import { Post } from '@/utils/request.ts'
import type { ILoginApi, ILoginParams } from './types'

export async function loginApi<T extends ILoginParams>(data: T) {
  const resultApi = Post<ILoginApi>('http://localhost:3000/user/login', data)
  return await resultApi.data
}
