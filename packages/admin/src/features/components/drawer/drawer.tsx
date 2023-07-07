import { defineComponent } from 'vue'
import { NDrawer, NDrawerContent } from 'naive-ui'
import { drawerPlacement } from '@/configs'
import { noop } from '@cc-heart/utils'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '500px',
    },
    title: {
      type: String,
      default: '',
    },
    onChange: {
      type: Function,
      default: noop,
    },
  },
  setup(props, { slots }) {
    const handleVisible = (visible: boolean) => {
      props.onChange?.(visible)
    }
    return () => (
      <NDrawer
        show={props.visible}
        width={props.width}
        placement={drawerPlacement.value}
        onUpdateShow={handleVisible}
      >
        <NDrawerContent title={props.title} closable>
          {slots.default?.()}
        </NDrawerContent>
      </NDrawer>
    )
  },
})
