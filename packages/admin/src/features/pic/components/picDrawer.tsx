import { defineComponent, reactive, ref, watch } from 'vue'
import { Drawer } from '@/features/components/index.js'
import {
  NAlert,
  NBreadcrumb,
  NBreadcrumbItem,
  NButton,
  NIcon,
  NTree,
} from 'naive-ui'
import { getFileListByPath } from '@/features/pic/index.js'
import { noop } from '@cc-heart/utils'
import { Folder, FolderOpenOutline, FileTrayFull } from '@vicons/ionicons5'
import { Key, TreeOption, TreeOptionBase } from 'naive-ui/es/tree/src/interface'
import { useNamespace } from '@/hooks'
import './pic.scss'
interface TreeOptionBaseLoading {
  isLoading?: boolean
}
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
    const path = ref<string[]>([])
    const treeProps = reactive({
      data: [] as (TreeOptionBase & TreeOptionBaseLoading)[],
      parentData: null as (TreeOptionBase & TreeOptionBaseLoading) | null,
      expandKeys: [] as Key[],
    })

    const updateExpandKeys = (expandedKeys: string[]) => {
      treeProps.expandKeys = expandedKeys
    }

    const ns = useNamespace('pic')

    const getAbsolutePath = (
      key: Key,
      propsData = treeProps.data
    ): string | null => {
      for (let i = 0; i < propsData.length; i++) {
        const target = propsData[i]
        if (target.key === key) {
          return target.label!
        }
        if (target.children && Array.isArray(target.children)) {
          const childrenKey = getAbsolutePath(key, target.children)
          if (childrenKey) return `${target.label}/${childrenKey}`
        }
      }
      return null
    }

    const nodeProps = ({ option }: { option: TreeOption }) => {
      return {
        async onClick() {
          if (!option.isLeaf) {
            option.prefix = () => (
              <NIcon>
                {treeProps.expandKeys.includes(option.key!) ? (
                  <FolderOpenOutline />
                ) : (
                  <Folder />
                )}
              </NIcon>
            )
          }
          const key = option.key!
          const absolutePath = getAbsolutePath(key)
          // loading data
          if (absolutePath) {
            path.value = absolutePath.split('/')
          }
          if (
            !option.isLoading &&
            treeProps.expandKeys.includes(key) &&
            absolutePath
          ) {
            treeProps.parentData = option
            getData(absolutePath)
          }
        },
      }
    }

    const getData = async (namespace: string) => {
      if (treeProps.parentData && !treeProps.parentData.isLoading) {
        treeProps.parentData.isLoading = true
      }
      try {
        const { data } = await getFileListByPath(namespace)
        if (data && Array.isArray(data)) {
          if (treeProps.parentData) {
            treeProps.parentData.children = data.map((val) => {
              const target = {
                label: val.name,
                key: val.id,
              }
              if (!val.isFile) {
                Reflect.set(target, 'children', [])
              } else {
                Reflect.set(target, 'isLeaf', true)
              }
              Reflect.set(target, 'prefix', () => (
                <NIcon>{!val.isFile ? <Folder /> : <FileTrayFull />}</NIcon>
              ))
              return target
            })
          }
        }
      } catch (e) {
        console.error(e)
        treeProps.parentData && (treeProps.parentData.isLoading = false)
      }
    }
    watch(
      () => props.namespace,
      (namespace: string) => {
        if (namespace) {
          path.value = [namespace]
          treeProps.parentData = {
            label: namespace,
            isLeaf: false,
            isLoading: true,
            key: namespace,
            prefix: () => (
              <NIcon>
                <FolderOpenOutline />
              </NIcon>
            ),
          }
          treeProps.data = [treeProps.parentData]
          treeProps.expandKeys = [namespace]
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
        <NAlert type="info" showIcon={false}>
          <NBreadcrumb class={ns.b('path')}>
            {path.value.map((p) => {
              return (
                <NBreadcrumbItem>
                  <NButton text quaternary type="primary">
                    {p}
                  </NButton>
                </NBreadcrumbItem>
              )
            })}
          </NBreadcrumb>
        </NAlert>
        <NTree
          block-line
          expand-on-click
          nodeProps={nodeProps}
          data={treeProps.data}
          expandedKeys={treeProps.expandKeys}
          onUpdateExpandedKeys={updateExpandKeys}
        />
      </Drawer>
    )
  },
})
