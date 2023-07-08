import { defineComponent, ref } from 'vue'
import CForm from '@/components/form/form.tsx'
import { defineFormColumn } from '@/hooks/define/defineFormColumn.ts'
import { NButton } from 'naive-ui'
import { loginApi } from '@/features/login/api.ts'
import { IFormExpose } from '@/typings/form.ts'
import { transformColumnToData } from '@/utils/tranverse.ts'
import { setToken } from '@/storage/token.ts'
import { useI18n } from 'vue-i18n'
import { successMsg } from '@/utils'
import { ILoginParams } from '@/features/login/types'

export default defineComponent({
  setup() {
    const { t } = useI18n()
    const columns = defineFormColumn([
      {
        type: 'input',
        label: t('login.username'),
        field: 'username',
        props: {
          placeholder: t('login.usernamePlaceholder'),
        },
      },
      {
        type: 'input',
        label: t('login.password'),
        field: 'password',
        props: {
          placeholder: t('login.passwordPlaceholder'),
        },
      },
    ])

    const fieldList = transformColumnToData<ILoginParams>(columns.value)

    const formRef = ref<IFormExpose | null>(null)
    const login = async () => {
      try {
        await formRef.value?.validate()
        const { data, message } = await loginApi({ ...fieldList })
        if (data) {
          const { accessToken } = data
          successMsg(message)
          accessToken && setToken(accessToken)
        }
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
        <NButton onClick={login}>{t('login.loginButton')}</NButton>
      </div>
    )
  },
})
