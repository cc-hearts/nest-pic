import { NButton, NModal } from 'naive-ui'
import { hasOwn, noop } from '@cc-heart/utils'
import { defineComponent, ref, watch } from 'vue'
import CForm from '@/components/form/form'
import { defineFormColumn } from '@/hooks/define/defineFormColumn'
import {
  transformColumnRulesByData,
  transformColumnToData,
} from '@/utils/tranverse'
import { IFormExpose } from '@/typings/form'
import { addNamespace, updateNamespace } from '../apis'
import { successMsg } from '@/utils'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'AddNamespaceModal',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    onUpdateVisible: {
      type: Function,
      default: noop,
    },
    type: {
      type: String,
      default: 'add',
    },
    namespaceId: {
      type: Number,
      default: -1,
    },
  },
  emits: ['refresh'],
  setup(props, { emit, expose }) {
    const { t } = useI18n()
    const handleCancelVisible = () => {
      props.onUpdateVisible()
    }

    const columns = defineFormColumn([
      {
        field: 'name',
        label: t('namespace.name'),
        type: 'input',
        required: true,
        props: {
          placeholder: t('namespace.namespaceInputPlaceholder'),
        },
      },
    ])

    const fields = transformColumnToData(columns.value)
    const rules = transformColumnRulesByData(columns.value)

    const setFieldsValue = (data: Record<string, unknown>) => {
      Object.keys(data).forEach((key) => {
        if (hasOwn(fields, key)) {
          fields[key] = data[key]
        }
      })
    }

    expose({ setFieldsValue })

    const formRef = ref<IFormExpose | null>(null)

    const handleSubmit = async () => {
      await formRef.value?.validate()
      const name = Reflect.get(fields, 'name') as string
      const fn = props.type === 'add' ? addNamespace : updateNamespace
      const args = props.type === 'add' ? [name] : [props.namespaceId, name]
      const { message } = await Reflect.apply(fn, null, args)
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

    return () => (
      <NModal
        show={props.visible}
        preset="card"
        title={t('pic.addNamespace', {
          type: props.type === 'add' ? t('add') : t('edit'),
        })}
        mask-closable={false}
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
