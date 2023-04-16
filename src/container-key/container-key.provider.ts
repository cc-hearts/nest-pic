import { dataSourceProviderFactory } from 'utils/dataSourceProvider'
import { ContainerKey } from './container-key.entity'
export const containerKeyProvider = dataSourceProviderFactory(
  'CONTAINER_KEY',
  ContainerKey
)
