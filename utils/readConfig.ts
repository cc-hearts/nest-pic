import { parse } from 'yaml'
import { readFileSync } from 'fs'
import * as process from 'process'
import { resolve } from 'path'

interface IConfig {
  mysql: IMysql
  oss_prefix: string
  host: string
  port: number
}

type IMysql = {
  type: 'mysql'
  database: string
  username: string
  password: string
  host: string
  logging: boolean
  port: number
}


let config: IConfig

export function getConfig() {
  if (!config) {
    const env = process.env.NODE_ENV || 'development'
    const data = readFileSync(resolve(process.cwd(), `app.${env}.yaml`), {
      encoding: 'utf-8',
    })
    if (data) {
      config = parse(data)
    } else {
      throw new Error('readFile yaml is error:')
    }
  }
  return config
}
