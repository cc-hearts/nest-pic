import { randomUUID } from 'crypto'

export function genUUID() {
  return randomUUID()
}

export function addPrefixSelection(prefix: string, arr: string[]) {
  return arr.map((val) => `${prefix}.${val}`)
}

export function deletePropertyFromObject<T extends Record<string, unknown>>(
  target: T,
  propertyList: string[]
) {
  propertyList.forEach((property) => {
    Reflect.deleteProperty(target, property)
  })
}
