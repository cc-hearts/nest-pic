import { NButton, NCard, NModal } from 'naive-ui'
import { noop } from '@cc-heart/utils'
import { defineComponent, ref } from 'vue'
import CForm from '@/components/form/form'
import { defineFormColumn } from '@/hooks/define/defineFormColumn'
import { transformColumnToData } from '@/utils/tranverse'
import { IFormExpose } from '@/typings/form'
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
  setup(props) {
    const handleCancelVisible = () => {
      props.onUpdateVisible()
    }

    const columns = defineFormColumn([
      {
        field: 'name',
        label: '命名空间',
        type: 'input',
      },
    ])

    const fields = transformColumnToData(columns.value)

    const formRef = ref<IFormExpose | null>(null)

    const handleSubmit = async () => {
      await formRef.value?.validate()
      console.log(fields);
    }

    return () => (
      <NModal
        show={props.visible}
        preset="card"
        title="添加命名空间"
        mask-closable={false}
        style="width: 600px"
        onMaskClick={handleCancelVisible}
      >
        {{
          default: () => <CForm columns={columns.value} v-model={fields} ref={formRef} />,
          footer: () => (
            <div class="text-right">
              <NButton type="success" onClick={handleSubmit}>确定</NButton>
            </div>
          ),
        }}
      </NModal>
    )
  },
})
