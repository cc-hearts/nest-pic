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
import type { fn, getArraySubitem } from '@cc-heart/utils/helper'
import { successMsg, warn } from '@/utils'
import { transformPaginationParams } from '@/utils/transform'
import { useI18n } from 'vue-i18n'
import { TransverseIDataSource } from '@/typings'
type IData = getArraySubitem<TransverseIDataSource<typeof getPicList>>
export default defineComponent({
  name: 'Pic',
  setup() {
    const { paginationReactive, _sizeChange, _currentChange } = usePagination()
    const { t } = useI18n()
    const state = defineTableState()
    const visible = ref(false)
    const modalVisible = ref(false)
    const namespaceState = reactive({
      type: 'add',
      namespaceId: -1,
    })
    const namespaceRef = ref<{
      setFieldsValue: (data: Record<string, unknown>) => void
    } | null>(null)
    const onUpdatePage = _currentChange(getData)
    const onUpdatePageSize = _sizeChange(getData)
    const picDrawerProps = reactive({
      nid: -1,
      namespace: '',
    })

    const dialog = useDialog()
    const handleDeleteTableData = (rowData: IData) => {
      dialog.warning({
        title: t('pic.confirmTitle'),
        content: t('pic.confirmContent'),
        positiveText: t('positiveText'),
        negativeText: t('negativeText'),
        onPositiveClick: async () => {
          const { id } = rowData
          const { message } = await removeNamespace(id)
          successMsg(message)
          getData()
        },
      })
    }

    const handleEditNamespace = (rowData: IData) => {
      namespaceState.namespaceId = rowData.id
      toggleModalVisible('edit')
      namespaceRef.value?.setFieldsValue({
        name: rowData.containerKey,
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
                        <NButton
                          ghost
                          type="warning"
                          class="m-r-2"
                          onClick={() => handleEditNamespace(rowData)}
                        >
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

    const toggleModalVisible = (type: 'add' | 'edit' = 'add') => {
      namespaceState.type = type
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
              onClick={() => toggleModalVisible('add')}
              type="primary"
              ghost
            >
              {t('pic.addNamespace', { type: t('add') })}
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
            ref={namespaceRef}
            visible={modalVisible.value}
            {...namespaceState}
            onUpdateVisible={toggleModalVisible}
            onRefresh={getData}
          />
        </div>
      </div>
    )
  },
})
