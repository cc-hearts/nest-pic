import { IForm, IFormItem } from '@/typings/form.ts'
import { FormRules } from 'naive-ui'
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
  U extends Record<string, any>,
  T extends IForm = IForm
>(data: T) {
  const fieldList = data.reduce<U>((acc, cur) => {
    if (cur.field) {
      Reflect.set(acc, cur.field, initDefaultValue(cur))
    }
    return acc
  }, {} as U)
  return reactive(fieldList)
}

export function transformColumnRulesByData<T extends IForm>(
  data: T
): FormRules {
  return data.reduce<FormRules>((acc, cur) => {
    if (cur.required) {
      if (!acc[cur.field]) acc[cur.field] = []
      Reflect.apply(Array.prototype.push, acc[cur.field], [
        {
          required: true,
          message: cur.message || `${cur.label || cur.field}字段必填`,
        },
      ])
    }
    if (cur.rules && Array.isArray(cur.rules)) {
      Reflect.apply(Array.prototype.push, acc[cur.field], cur.rules)
    }
    return acc
  }, {})
}
