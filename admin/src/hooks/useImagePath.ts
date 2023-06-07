import { baseUrl, ossPrefix } from '@/configs'

export function useImagePath(imgPath: string) {
  return `${baseUrl}/${ossPrefix}/${imgPath}`
}
