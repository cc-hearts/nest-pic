import type { cb } from '../typings'

const set = new WeakSet<cb>()

/**
 * 白名单鉴权
 */
export const WhitePath = () => {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    set.add(descriptor.value)
  }
}

export function isExistWhitePath(func: cb) {
  return set.has(func)
}
