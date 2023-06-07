import { defineComponent, onMounted, reactive, ref } from 'vue'
import { NDataTable, NTag } from 'naive-ui'
import { getPicList } from '@/features/pic'
import { defineTableState, usePagination } from '@/hooks'
import { isObject } from '@cc-heart/utils'
import { warn } from '@/utils'
import PicDrawer from './picDrawer'
export default defineComponent({
  name: 'Pic',
  setup() {
    const { paginationReactive } = usePagination()
    const state = defineTableState()
    const picDrawerProps = reactive({
      nid: -1,
      namespace: '',
    })
    const visible = ref(false)
    async function getData() {
      try {
        const { data } = (await getPicList(paginationReactive.pagination)) || {}

        if (isObject(data)) {
          const { columns, dataSource, total } = data
          state.columns = columns.map((val) => {
            if (val.slot) {
              val.render = (rowData) => {
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
            }
            return val
          })
          state.data = dataSource
          paginationReactive.total = total
        }
      } catch (error) {
        warn(String(error))
      }
    }

    const onChangeVisible = (bool: boolean) => (visible.value = bool)

    onMounted(() => {
      getData()
    })

    return () => (
      <div class="grid w-full h-full p-10">
        <div class="place-self-center w-full">
          <NDataTable {...state} pagination={paginationReactive.pagination} />
          <PicDrawer
            {...picDrawerProps}
            visible={visible.value}
            onChange={onChangeVisible}
          />
        </div>
      </div>
    )
  },
})
