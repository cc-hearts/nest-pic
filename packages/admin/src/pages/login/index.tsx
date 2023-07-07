import { defineComponent, ref } from 'vue'
import CForm from '@/components/form/form.tsx'
import { defineFormColumn } from '@/hooks/define/defineFormColumn.ts'
import { NButton } from 'naive-ui'
import { loginApi } from '@/features/login/api.ts'
import { IFormExpose } from '@/typings/form.ts'
import { transformColumnToData } from '@/utils/tranverse.ts'
import { setToken } from '@/storage/token.ts'

export default defineComponent({
  setup() {
    const columns = defineFormColumn([
      {
        type: 'input',
        label: '账号',
        field: 'username',
        props: {
          placeholder: '请输入账号',
        },
      },
      {
        type: 'input',
        label: '密码',
        field: 'password',
        props: {
          placeholder: '请输入密码',
        },
      },
    ])

    const fieldList = transformColumnToData(columns.value)

    const formRef = ref<IFormExpose | null>(null)
    const login = async () => {
      try {
        await formRef.value?.validate()
        const data = await loginApi({ ...fieldList })
        const { accessToken } = data
        accessToken && setToken(accessToken)
      } catch (e) {
        console.log(e)
      }
    }
    return () => (
      <div class="flex w-full h-full flex-col justify-center	items-center">
        <CForm
          v-model={fieldList}
          ref={formRef}
          columns={columns.value}
        ></CForm>
        <NButton onClick={login}>登陆</NButton>
      </div>
    )
  },
})
