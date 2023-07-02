export const filterFalsyOfObject = <T extends object>(
  data: T,
  excludesFilter: string[] = []
) => {
  return Object.keys(data).reduce((acc, key) => {
    if (
      excludesFilter.includes(key) ||
      typeof data[key] === 'number' ||
      data[key]
    ) {
      acc[key] = data[key]
    }
    return acc
  }, {} as T)
}
