export interface IFormItem {
  type: string
  label: string
  field: string
  span?: number
  defaultValue?: string | number | Array<unknown>
  props?: Record<string, any>
  required?: boolean
  [s: string]: unknown
}
export type IForm = Array<IFormItem>

export interface IFormExpose {
  validate: () => Promise<Error | void>
}
