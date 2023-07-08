import type { IForm, IFormItem } from '@/typings/form.ts'
import { NForm, NFormItemGi, NGrid, NInput } from 'naive-ui'
import { defineComponent, ref, type PropType } from 'vue'

const componentReflect = {
  input: NInput,
}

let DEFAULT_COLS: number
const DEFAULT_SPAN = (DEFAULT_COLS = 24)

export default defineComponent({
  props: {
    columns: {
      type: Array as PropType<IForm>,
      default: () => [],
    },
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { attrs, expose }) {
    const formRef = ref()
    const columns: IForm = props.columns || ([] as IForm)
    const cols = Number(attrs?.cols) || DEFAULT_COLS

    const validate = (): Promise<Error | void> => {
      return new Promise((resolve, reject) => {
        formRef.value?.validate((error: Error) => {
          if (error) {
            reject(error)
            return
          }
          resolve()
        })
      })
    }

    const handleChange = (e: any, column: IFormItem) => {
      const { field } = column
      const fields = props.modelValue
      fields[field] = e
    }

    expose({ validate })

    return () => (
      <NForm ref={formRef} model={props.modelValue} rules={props.rules}>
        <NGrid cols={cols} xGap={24}>
          {columns.map((column) => {
            const Component = Reflect.get(componentReflect, column.type)
            const span = column.span || DEFAULT_SPAN
            const formProps = column.props || {}
            return (
              <NFormItemGi path={column.field} span={span} label={column.label}>
                <Component
                  {...formProps}
                  value={props.modelValue[column.field]}
                  onUpdateValue={(e: any) => handleChange(e, column)}
                />
              </NFormItemGi>
            )
          })}
        </NGrid>
      </NForm>
    )
  },
})
