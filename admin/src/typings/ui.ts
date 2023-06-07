import { VNodeChild } from 'vue'

export type placementType =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom'
  | 'top'

export interface ITableColumn<T = any> {
  title: string
  key: string
  slot?: string
  labelSlot?: { name: string }
  render?: (rowData: T, index: number) => VNodeChild
}

export interface ITableResponse<T = RowData> {
  columns: Array<ITableColumn<T>>
  dataSource: T[]
  total?: number
}

export type RowData = Record<string, any>
