import { defineComponent, onMounted, reactive, ref } from 'vue'
import { NButton, NDataTable, NTag, useDialog } from 'naive-ui'
import {
  getPicList,
  AddNamespace,
  PicDrawer,
  genNamespaceApi,
  removeNamespace,
} from '@/features/pic'
import { defineTableState, usePagination } from '@/hooks'
import { isObject, noop } from '@cc-heart/utils'
import type { fn } from '@cc-heart/utils/helper'
import { successMsg, warn } from '@/utils'
import { transformPaginationParams } from '@/utils/transform'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'Pic',
  setup() {
    const { paginationReactive, _sizeChange, _currentChange } = usePagination()
    const { t } = useI18n()
    const state = defineTableState()
    const visible = ref(false)
    const modalVisible = ref(false)
    const onUpdatePage = _currentChange(getData)
    const onUpdatePageSize = _sizeChange(getData)
    const picDrawerProps = reactive({
      nid: -1,
      namespace: '',
    })

    const dialog = useDialog()
    const handleDeleteTableData = (rowData) => {
      dialog.warning({
        title: '确认框',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
          const { id } = rowData
          const { message } = await removeNamespace(id)
          successMsg(message)
          getData()
        },
      })
    }

    async function getData() {
      try {
        const { data } =
          (await getPicList(
            transformPaginationParams(paginationReactive.pagination)
          )) || {}

        if (isObject(data)) {
          const { columns, dataSource, total } = data
          state.columns = columns.map((val) => {
            if (val.slot) {
              let render: fn = noop
              switch (val.slot) {
                case 'containerKey':
                  render = (rowData) => {
                    return (
                      <div
                        onClick={() => {
                          visible.value = !visible.value
                          picDrawerProps.nid = rowData.id
                          picDrawerProps.namespace = rowData.containerKey
                        }}
                      >
                        <NTag
                          bordered={false}
                          type="success"
                          class="cursor-pointer"
                        >
                          {Reflect.get(rowData, val.slot!)}
                        </NTag>
                      </div>
                    )
                  }
                  break
                case 'action':
                  render = (rowData) => {
                    return (
                      <div>
                        <NButton ghost type="warning" class="m-r-2">
                          {t('edit')}
                        </NButton>
                        <NButton
                          type="error"
                          ghost
                          onClick={() => handleDeleteTableData(rowData)}
                        >
                          {t('delete')}
                        </NButton>
                      </div>
                    )
                  }
                  break
              }
              val.render = render
            }
            return val
          })
          state.data = dataSource
          paginationReactive.itemCount = total
        }
      } catch (error) {
        warn(String(error))
      }
    }

    const onChangeVisible = (bool: boolean) => (visible.value = bool)

    const toggleModalVisible = () => {
      modalVisible.value = !modalVisible.value
    }

    const genNamespace = async () => {
      const { message } = await genNamespaceApi()
      successMsg(message)
      getData()
    }

    onMounted(() => {
      getData()
    })

    return () => (
      <div class="grid w-full h-full p-10">
        <div class="place-self-center w-full">
          <div class="m-b-2 text-right">
            <NButton
              class="m-r-2"
              onClick={toggleModalVisible}
              type="primary"
              ghost
            >
              {t('pic.addNamespace')}
            </NButton>
            <NButton onClick={genNamespace} type="primary" ghost>
              {t('pic.autoGeneratorNamespace')}
            </NButton>
          </div>
          <NDataTable
            remote
            pagination={{
              ...paginationReactive,
              onUpdatePage,
              onUpdatePageSize,
            }}
            {...state}
          />
          <PicDrawer
            {...picDrawerProps}
            visible={visible.value}
            onChange={onChangeVisible}
          />
          <AddNamespace
            visible={modalVisible.value}
            onUpdateVisible={toggleModalVisible}
            onRefresh={getData}
          />
        </div>
      </div>
    )
  },
})
