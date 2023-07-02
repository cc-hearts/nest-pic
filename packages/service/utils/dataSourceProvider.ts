import { dataBaseProviders } from 'provider/dataBase.provider'
import { DataSource } from 'typeorm'
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral'
import { EntityTarget } from 'typeorm/common/EntityTarget'

export function dataSourceProviderFactory(
  provide: string,
  factory: EntityTarget<ObjectLiteral>
) {
  return [
    ...dataBaseProviders,
    {
      provide,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(factory),
      inject: ['DATA_SOURCE'],
    },
  ]
}
