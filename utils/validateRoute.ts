import { getConfig } from 'utils'
export function validateRoute(route: string, method: string, user: object) {
  const { SYSTEM_ID } = getConfig()
  const routerList = Reflect.get(user, SYSTEM_ID)
  if (!routerList || routerList.length === 0) return false
  const methodList = Reflect.get(routerList, route)
  if (!methodList || methodList.length === 0) return false
  return (methodList as Array<string>).includes(method)
}
