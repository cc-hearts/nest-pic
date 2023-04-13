// getPkg 获取package.json 中的数据
import { readFileSync } from 'fs'
import { resolve } from 'path'

export function getPkg() {
  const pkg = readFileSync(resolve(__dirname, '../../', 'package.json'), {
    encoding: 'utf-8',
  })
  return JSON.parse(pkg)
}
