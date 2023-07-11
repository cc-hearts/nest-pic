import {
  NButton,
  NInput,
  NInputGroup,
  NInputGroupLabel,
  NModal,
} from 'naive-ui'
import { PropType, defineComponent, ref, watch } from 'vue'
import CForm from '@/components/form/form'
import { defineFormColumn } from '@/hooks/define/defineFormColumn'
import { useI18n } from 'vue-i18n'
import {
  transformColumnRulesByData,
  transformColumnToData,
} from '@/utils/tranverse'
import { IFormExpose } from '@/typings/form'
import { hasOwn, noop } from '@cc-heart/utils'
import { changeFileName, getFilePath } from '../apis'
import { successMsg } from '@/utils'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    prop: {
      type: Object as PropType<{ path: string }>,
      default: () => ({}),
    },
    onUpdateVisible: {
      type: Function,
      default: noop,
    },
  },
  emits: ['refresh'],
  setup(props, { expose, emit }) {
    const formRef = ref<IFormExpose | null>(null)

    const { t } = useI18n()

    const state = {
      suffix: '',
    }
    const columns = defineFormColumn([
      {
        field: 'fileName',
        label: t('changeFileName.name'),
        type: 'input',
        required: true,
        props: {
          placeholder: t('changeFileName.fileNamePlaceholder'),
        },
        render() {
          return (
            <NInputGroup>
              <NInput
                value={fields['fileName']}
                onUpdateValue={(e) => (fields['fileName'] = e)}
              />
              <NInputGroupLabel>.{state.suffix}</NInputGroupLabel>
            </NInputGroup>
          )
        },
      },
    ])

    const fields = transformColumnToData(columns.value)
    const rules = transformColumnRulesByData(columns.value)
    const setFieldsValue = (data: Record<string, unknown>) => {
      Object.keys(data).forEach((key) => {
        if (hasOwn(fields, key)) {
          if (key === 'fileName') {
            const fileSplits = (data[key] as string)?.split('.')
            state.suffix = fileSplits.slice(-1).join('') || ''
            fields[key] = fileSplits.slice(0, -1).join('.')
          } else {
            fields[key] = data[key]
          }
        }
      })
    }

    expose({ setFieldsValue })

    const handleSubmit = async () => {
      await formRef.value?.validate()

      const { path: originFilePath } = props.prop
      const fileName = Reflect.get(fields, 'fileName') as string
      const { message } = await changeFileName({
        originFilePath,
        fileName: `${fileName}.${state.suffix}`,
      })
      successMsg(message)
      handleCancelVisible()
      emit('refresh')
    }

    watch(
      () => props.visible,
      (visible) => {
        if (!visible) {
          fields.name = ''
        }
      }
    )
    const handleCancelVisible = () => {
      props.onUpdateVisible()
    }

    return () => (
      <NModal
        show={props.visible}
        preset="card"
        style="width: 600px"
        onMaskClick={handleCancelVisible}
        onClose={handleCancelVisible}
      >
        {{
          default: () => (
            <CForm
              columns={columns.value}
              v-model={fields}
              ref={formRef}
              rules={rules}
            />
          ),
          footer: () => (
            <div class="text-right">
              <NButton type="success" onClick={handleSubmit}>
                {t('ok')}
              </NButton>
            </div>
          ),
        }}
      </NModal>
    )
  },
})
