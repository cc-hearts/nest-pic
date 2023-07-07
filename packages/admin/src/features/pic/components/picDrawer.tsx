import { defineComponent, watch } from 'vue'
import { Drawer } from '@/features/components/index.js'
import { NDataTable, NImage, NPopover, NTag } from 'naive-ui'
import { defineTableState, useImagePath, usePagination } from '@/hooks/index.js'
import { getUploadFileList, getFileListByPath } from '@/features/pic/index.js'
import { isObject, noop } from '@cc-heart/utils'
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    onChange: {
      type: Function,
      default: noop,
    },
    nid: {
      type: Number,
      default: -1,
    },
    namespace: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const state = defineTableState()
    const { paginationReactive } = usePagination()
    const getData = async (namespace: string) => {
      const { data } = await getUploadFileList({
        namespace,
        ...paginationReactive.pagination,
      })

      // TODO: refactor
      // console.log(await getFileListByPath(namespace))
      if (isObject(data)) {
        const { columns, dataSource, total } = data
        state.data = dataSource
        paginationReactive.total = total
        state.columns = columns.map((column) => {
          if (column.slot === 'filePath') {
            column.render = (rowData) => {
              return (
                <NPopover trigger="click">
                  {{
                    trigger: () => <NTag>{rowData.filePath}</NTag>,
                    default: () => (
                      <NImage src={useImagePath(rowData.filePath)} />
                    ),
                  }}
                </NPopover>
              )
            }
          }
          return column
        })
      }
    }
    watch(
      () => props.namespace,
      (namespace: string) => {
        if (namespace) {
          getData(namespace)
        }
      },
      {
        immediate: true,
      }
    )
    return () => (
      <Drawer
        title={props.namespace}
        visible={props.visible}
        onChange={props.onChange}
      >
        <NDataTable {...state} pagination={paginationReactive.pagination} />
      </Drawer>
    )
  },
})