import { Post } from '@/utils/request.ts'

export const loginApi = async (data) => {
  const resultApi = Post('http://localhost:3000/user/login', data)
  return await resultApi.data
}
