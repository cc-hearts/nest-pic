import {
  NModal,
  NButton,
  NDescriptionsItem,
  NDescriptions,
  NPopconfirm,
  NDivider,
  NH2,
} from 'naive-ui'
import { defineComponent, ref, watch } from 'vue'
import { hasOwn, noop } from '@cc-heart/utils'
import { useI18n } from 'vue-i18n'
import { getUPicConfig } from '../apis'
import './upic-config.modal.scss'
import { copy } from '@cc-heart/utils-client'
import { successMsg } from '@/utils'
export default defineComponent({
  name: 'UPicConfigModal',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    config: {
      type: String,
      default: '',
    },
    onUpdateVisible: {
      type: Function,
      default: noop,
    },
  },
  setup(props) {
    const { t } = useI18n()

    const handleCancelVisible = () => {
      props.onUpdateVisible()
    }

    const handleCopy = (text: string) => {
      copy(text)
      successMsg(t('upic.copySuccess'))
    }

    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          getData()
        }
      }
    )
    const descriptionList = ref([
      { label: 'API地址', field: 'api', value: '' },
      { label: '请求方式', field: 'method', value: '' },
      { label: '文件字段名', field: 'fileParamName', value: '' },
      { label: 'URL路径', field: 'urlPath', value: '' },
      { label: '保存路径', field: 'savePath', value: '' },
    ])

    const headersDescriptionList = ref([
      { label: 'Authorization', field: 'authorization', value: '' },
    ])
    const bodyDescriptionList = ref([
      { label: 'filename', field: 'filename', value: '' },
      { label: 'suffix', field: 'suffix', value: '' },
      { label: 'key', field: 'key', value: '' },
    ])
    type DescriptionList = { label: string; field: string; value: string }
    const setValue = (list: DescriptionList[], data: Record<string, any>) => {
      list.forEach((target) => {
        if (hasOwn(data, target.field)) {
          target.value = Reflect.get(data, target.field)
        }
      })
    }

    const getData = async () => {
      getUPicConfig({ key: props.config }).then((res) => {
        const { data } = res
        if (data) {
          setValue(descriptionList.value, data)
          setValue(headersDescriptionList.value, data.otherFields.headers)
          setValue(bodyDescriptionList.value, data.otherFields.body)
        }
      })
    }

    const descriptionItem = (description: DescriptionList) => {
      return (
        <NDescriptionsItem label={description.label}>
          <NPopconfirm
            negative-text={null}
            showIcon={false}
            positiveButtonProps={{ quaternary: true }}
            positiveText={t('copy')}
            onPositiveClick={() => handleCopy(description.value)}
          >
            {{
              trigger: () => (
                <span class={'upic-description'}>{description.value}</span>
              ),
              default: () => (
                <span class={'upic-description'}>{description.value}</span>
              ),
            }}
          </NPopconfirm>
        </NDescriptionsItem>
      )
    }

    return () => (
      <NModal
        show={props.visible}
        preset="card"
        title={t('upic.modalTitle')}
        class={'upic'}
        style="width: 700px"
        onMaskClick={handleCancelVisible}
        onClose={handleCancelVisible}
      >
        {{
          default: () => (
            <div>
              <NDescriptions column={1} label-placement="left">
                {descriptionList.value.map((description) =>
                  descriptionItem(description)
                )}
              </NDescriptions>
              <NDivider />
              <NH2>{t('upic.modalSubTitle')}</NH2>
              <NDescriptions
                column={1}
                label-placement="left"
                title={t('upic.headersTitle')}
              >
                {headersDescriptionList.value.map((description) =>
                  descriptionItem(description)
                )}
              </NDescriptions>
              <NDivider />
              <NDescriptions
                column={1}
                label-placement="left"
                title={t('upic.bodyTitle')}
              >
                {bodyDescriptionList.value.map((description) =>
                  descriptionItem(description)
                )}
              </NDescriptions>
            </div>
          ),
          footer: () => (
            <div class="text-right">
              <NButton type="success" onClick={handleCancelVisible}>
                {t('negativeText')}
              </NButton>
            </div>
          ),
        }}
      </NModal>
    )
  },
})
