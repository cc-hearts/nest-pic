import { defineComponent, reactive, watch } from 'vue'
import { NMenu } from 'naive-ui'
import { useRoute } from 'vue-router'
import { menuOptions } from './menuConstants.js'
export default defineComponent({
  name: 'MenuComponents',
  setup() {
    const route = useRoute()
    const state = reactive({
      activeKey: null as string | null,
    })
    watch(
      () => route.path,
      (path) => {
        if (path !== state.activeKey) {
          state.activeKey = path
        }
      }
    )
    return () => (
      <NMenu
        mode="horizontal"
        v-model:value={state.activeKey}
        options={menuOptions}
      ></NMenu>
    )
  },
})
