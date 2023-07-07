import { IForm, IFormItem } from '@/typings/form.ts'
import { reactive } from 'vue'

function initDefaultValue(formItem: IFormItem) {
  if (formItem.defaultValue) return formItem.defaultValue
  switch (formItem.field) {
    case 'input':
      return ''
    default:
      return ''
  }
}
export function transformColumnToData<
  T extends IForm,
  U extends Record<string, unknown>
>(data: T) {
  const fieldList = data.reduce<U>((acc, cur) => {
    if (cur.field) {
      Reflect.set(acc, cur.field, initDefaultValue(cur))
    }
    return acc
  }, {} as U)
  return reactive(fieldList)
}
