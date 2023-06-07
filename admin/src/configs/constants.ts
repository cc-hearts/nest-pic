import { ref } from 'vue'
import { useIsDark } from '@/hooks'
export const baseUrl = 'http://localhost:30002'
export const prefix = 'v1'
export const fileUrl = 'http://oss.cc-heart.cn:30002'
export const ossPrefix = 'oss'
export const defaultNamespace = 'cc'
export const isDark = ref(useIsDark())

export const isDev = process.env.NODE_ENV === 'development'
export const isProd = process.env.NODE_ENV === 'production'

export const githubUrl = 'https://github.com/cc-hearts/nest-pic.git'
