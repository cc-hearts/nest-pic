import { ref } from 'vue'
import { useIsDark } from '@/hooks'
export const isDev = process.env.NODE_ENV === 'development'
export const isProd = process.env.NODE_ENV === 'production'

export const prefix = 'v1'
export const ossPrefix = 'oss'
export const defaultNamespace = 'cc'

let baseUrl, fileUrl, url

url = isDev ? 'http://localhost:30002' : 'http://www.cc-hearts.cn:30002'
baseUrl = fileUrl = url

export { baseUrl, fileUrl }

export const isDark = ref(useIsDark())

export const githubUrl = 'https://github.com/cc-hearts/nest-pic.git'
