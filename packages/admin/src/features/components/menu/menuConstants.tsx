import type { MenuOption } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

function useRouterLink(label: string, path: string) {
  return {
    label: () => <RouterLink to={{ path }}>{label}</RouterLink>,
    key: path,
  }
}
export function getMenuOptions() {
  const { t } = useI18n()
  const menuOptions: MenuOption[] = [
    useRouterLink(t('login.label'), '/login'),
    useRouterLink(t('pic.label'), '/home/pic'),
  ]
  return menuOptions
}
