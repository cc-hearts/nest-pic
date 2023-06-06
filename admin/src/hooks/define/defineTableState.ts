import { ITableColumn, RowData } from "@/typings";
import { reactive } from "vue";
export function defineTableState<T extends RowData, C extends ITableColumn>() {
  return reactive({
    columns: [] as Array<C>,
    data: [] as Array<T>,
  })
}