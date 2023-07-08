import { defineComponent, watch } from 'vue'
import { Drawer } from '@/features/components/index.js'
import { NDataTable, NImage, NPopover, NTag, NTree } from 'naive-ui'
import { defineTableState, useImagePath, usePagination } from '@/hooks/index.js'
import { getUploadFileList, getFileListByPath } from '@/features/pic/index.js'
import { isObject, noop } from '@cc-heart/utils'
import { transformPaginationParams } from '@/utils/transform'
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
    // const state = defineTableState()
    // const { paginationReactive } = usePagination()
    const getData = async (namespace: string) => {
      // const { data } = await getUploadFileList({
      //   namespace,
      //   ...transformPaginationParams(paginationReactive.pagination),
      // })

      // TODO: refactor
      const { data } = await getFileListByPath(namespace)
      //
      // if (isObject(data)) {
      //   const { columns, dataSource, total } = data
      //   state.data = dataSource
      //   paginationReactive.itemCount = total
      //   state.columns = columns.map((column) => {
      //     if (column.slot === 'filePath') {
      //       column.render = (rowData) => {
      //         return (
      //           <NPopover trigger="click">
      //             {{
      //               trigger: () => <NTag>{rowData.filePath}</NTag>,
      //               default: () => (
      //                 <NImage src={useImagePath(rowData.filePath)} />
      //               ),
      //             }}
      //           </NPopover>
      //         )
      //       }
      //     }
      //     return column
      //   })
      // }
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
        {/* <NDataTable {...state} pagination={paginationReactive.pagination} /> */}
        <NTree block-line />
      </Drawer>
    )
  },
})
