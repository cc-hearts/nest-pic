import * as process from 'process'

export const isObject = (value: unknown) =>
  Object.prototype.hasOwnProperty.call(value) === '[object Object]'

export const isProd = () => process.env.NODE_ENV === 'production'
