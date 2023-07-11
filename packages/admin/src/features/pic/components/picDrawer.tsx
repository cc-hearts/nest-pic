import { VNodeRef, defineComponent, reactive, ref, watch } from 'vue'
import { Drawer } from '@/features/components/index.js'
import {
  NAlert,
  NBreadcrumb,
  NBreadcrumbItem,
  NButton,
  NIcon,
  NTree,
} from 'naive-ui'
import NImagePreview from 'naive-ui/es/image/src/ImagePreview'
import { getFileListByPath, getFilePath } from '@/features/pic/index.js'
import { noop } from '@cc-heart/utils'
import {
  Folder,
  FolderOpenOutline,
  FileTrayFull,
  EyeOutline,
  PencilOutline,
} from '@vicons/ionicons5'
import { Key, TreeOption, TreeOptionBase } from 'naive-ui/es/tree/src/interface'
import { useNamespace } from '@/hooks'
import './pic.scss'
import ChangeFileNameModal from './changeFileNameModal'
import { fn } from '@cc-heart/utils/helper'
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
    const previewInstRef = ref<VNodeRef | null>(null)
    const changeFileNameModalRef = ref<{ setFieldsValue: fn }>()
    const treeProps = reactive({
      data: [] as (TreeOptionBase & TreeOptionBaseLoading)[],
      parentData: null as (TreeOptionBase & TreeOptionBaseLoading) | null,
      expandKeys: [] as Key[],
    })
    const modalVisibleProps = reactive({
      visible: false,
      prop: { path: '' } as { path: string },
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

    const setParentData = (
      key: Key,
      parentData: (TreeOptionBase & TreeOptionBaseLoading) | null = null,
      propsData = treeProps.data,
      status = { end: false }
    ): void => {
      if (status.end) return
      for (let i = 0; i < propsData.length; i++) {
        const target = propsData[i]
        if (target.key === key) {
          treeProps.parentData = parentData
          status.end = true
          return
        }
        if (target.children && Array.isArray(target.children)) {
          setParentData(key, target, target.children, status)
        }
      }
    }

    const handleChangeFileName = async (target: TreeOption) => {
      const { key } = target
      if (!key) return
      const path = getAbsolutePath(String(key))
      if (path) {
        modalVisibleProps.visible = true
        Reflect.set(modalVisibleProps.prop, 'path', path)
        setParentData(key)
        changeFileNameModalRef.value?.setFieldsValue({ fileName: target.label })
      }
    }

    const handlePreview = async (key: Key, event: MouseEvent) => {
      event.stopPropagation()
      const path = getAbsolutePath(key)
      if (path) {
        const { data } = await getFilePath(path)
        if (data) {
          previewInstRef.value?.setPreviewSrc(data.url)
          previewInstRef.value?.toggleShow()
        }
      }
    }

    const handleRefresh = () => {
      if (treeProps.parentData) {
        treeProps.parentData.isLoading = false
        const key = getAbsolutePath(treeProps.parentData.key!)
        key && getData(key)
      }
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
                Reflect.set(target, 'suffix', () => (
                  <div class="flex items-center">
                    <span
                      class="m-r-2"
                      onClick={() => handleChangeFileName(target)}
                    >
                      <NIcon>
                        <PencilOutline />
                      </NIcon>
                    </span>
                    <span onClick={(e) => handlePreview(target.key, e)}>
                      <NIcon>
                        <EyeOutline />
                      </NIcon>
                    </span>
                  </div>
                ))
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
      () => props.visible,
      (visible: boolean) => {
        if (visible) {
          const { namespace } = props
          if (!namespace) return
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
                  <NButton text type="primary">
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
        <NImagePreview
          ref={previewInstRef}
          showToolbar
          showToolbarTooltip={false}
          clsPrefix={ns.b('preview')}
        ></NImagePreview>

        <ChangeFileNameModal
          ref={changeFileNameModalRef}
          {...modalVisibleProps}
          onUpdateVisible={() =>
            (modalVisibleProps.visible = !modalVisibleProps.visible)
          }
          onRefresh={handleRefresh}
        />
      </Drawer>
    )
  },
})
