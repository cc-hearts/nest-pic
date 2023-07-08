import { NButton, NModal } from 'naive-ui'
import { noop } from '@cc-heart/utils'
import { defineComponent, ref } from 'vue'
import CForm from '@/components/form/form'
import { defineFormColumn } from '@/hooks/define/defineFormColumn'
import { transformColumnToData } from '@/utils/tranverse'
import { IFormExpose } from '@/typings/form'
import { addNamespace } from '../apis'
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
  },
  emits: ['refresh'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const handleCancelVisible = () => {
      props.onUpdateVisible()
    }

    const columns = defineFormColumn([
      {
        field: 'name',
        label: '命名空间',
        type: 'input',
        props: {
          placeholder: '请输入命名空间名称',
        },
      },
    ])

    const fields = transformColumnToData(columns.value)

    const formRef = ref<IFormExpose | null>(null)

    const handleSubmit = async () => {
      await formRef.value?.validate()
      const name = Reflect.get(fields, 'name') as string
      const { message } = await addNamespace(name)
      successMsg(message)
      handleCancelVisible()
      emit('refresh')
    }

    return () => (
      <NModal
        show={props.visible}
        preset="card"
        title={t('pic.addNamespace')}
        mask-closable={false}
        style="width: 600px"
        onMaskClick={handleCancelVisible}
        onClose={handleCancelVisible}
      >
        {{
          default: () => (
            <CForm columns={columns.value} v-model={fields} ref={formRef} />
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
