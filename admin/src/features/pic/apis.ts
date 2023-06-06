import type { IPage, ITableResponse } from "@/typings";
import { Get } from "@/utils";
const prefix = 'container-key'

export function getPicList<T extends IPage>(params: T) {
  const { data } = Get<ITableResponse>(`/${prefix}/getPicList`, params)
  return data
}