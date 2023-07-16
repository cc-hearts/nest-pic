export interface INamespaceColumn {
  id: number
  containerKey: string
  uid: number
  removeFlag: number
}

export interface IGetConfig {
  api: string
  method: string
  fileParamName: string
  otherFields: IOtherFields
  urlPath: string
  savePath: string
}
interface IOtherFields {
  headers: IHeaders
  body: IBody
}
interface IBody {
  filename: string
  suffix: string
  key: string
}
interface IHeaders {
  authorization: string
}
