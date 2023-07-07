import { IFormItem } from '@/typings/form.ts'
import { ComputedRef, computed } from 'vue'

export function defineFormColumn<T extends IFormItem>(
  data: T[]
): ComputedRef<T[]> {
  return computed(() => data)
}
