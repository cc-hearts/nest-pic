import { type NotificationType, createDiscreteApi } from 'naive-ui'

type msgType = NotificationType
export function msg(type: msgType, meta: string, content?: string) {
  const { notification } = createDiscreteApi(['notification'])
  notification[type]({
    content,
    meta,
    duration: 2500,
    keepAliveOnHover: true,
  })
}

export function successMsg(message: string, title = '成功') {
  msg('success', message, title)
}

export function errorMsg(message: string, title = '错误') {
  msg('error', message, title)
}

export function warn(message: string) {
  console.warn(message)
}
