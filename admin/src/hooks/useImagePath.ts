import { fileUrl, ossPrefix } from '@/configs'

export function useImagePath(imgPath: string) {
  return `${fileUrl}/${ossPrefix}/${imgPath}`
}
