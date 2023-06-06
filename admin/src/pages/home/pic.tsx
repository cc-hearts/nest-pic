import { defineComponent, onMounted } from "vue";
import { NDataTable } from "naive-ui";
import { getPicList } from '@/features/pic'
import { defineTableState, usePagination } from "@/hooks";
import { isObject } from '@cc-heart/utils'
import { warn } from "@/utils";
import { NTag } from "naive-ui";
export default defineComponent({
  setup() {
    const { paginationReactive } = usePagination()
    const state = defineTableState();
    async function getData() {
      try {
        const { data } = await getPicList(paginationReactive.pagination) || {}
        if (isObject(data)) {
          const { columns, dataSource, total } = data
          state.columns = columns.map(val => {
            if (val.slot) {
              val.render = (rowData) => {
                return <NTag bordered={false} type="success">
                  {Reflect.get(rowData, val.slot!)}
                </NTag>
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
    onMounted(() => {
      getData()
    })
    return () => <div class='grid w-full h-full p-10'>
      <div class='place-self-center w-full'>
        <NDataTable
          {...state}
          pagination={paginationReactive.pagination}
        />
      </div>
    </div>
  }
})