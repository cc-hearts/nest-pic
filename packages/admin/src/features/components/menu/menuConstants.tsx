import type { MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'

function useRouterLink(label: string, path: string) {
  return {
    label: () => <RouterLink to={{ path }}>{label}</RouterLink>,
    key: path,
  }
}
export const menuOptions: MenuOption[] = [
  useRouterLink('命名空间', '/home/pic'),
  useRouterLink('令牌管理', '/tokenManger'),
]
