export const getUrlQuery = (url: string, key: string): string => {
  const queryList = url.split('?')[1]
  if (!queryList) return ''
  const queryGroup = queryList.split('&')
  let val = '',
    request = ''
  for (let i = 0; i < queryGroup.length; i++) {
    val = queryGroup[i]
    if (val === '') return
    const [k, value] = val.split('=')
    if (k === key) {
      request = value
      break
    }
  }
  return request
}

export function filterDataFalsy(
  data: Record<string, unknown>
): Record<string, unknown> {
  return Object.keys(data).reduce((acc, pre) => {
    if (data[pre]) {
      acc[pre] = data[pre]
    }
    return acc
  }, {})
}

export function deleteAttribute(
  data: Record<string, unknown>,
  keys: Array<keyof typeof data>
) {
  keys.forEach((val) => {
    delete data[val]
  })
}
