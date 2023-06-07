
import { dataSourceProviderFactory } from 'utils/dataSourceProvider'
import { Upload } from './upload.entity'
export const UploadProvider = dataSourceProviderFactory(
  'OSS_FILE',
  Upload
)
