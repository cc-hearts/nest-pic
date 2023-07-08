import { BasePaginationDto } from '../../common/basePagination.dto'
import { IsNotEmpty } from 'class-validator'
export class ContainerKeyDto extends BasePaginationDto {}

export class AddNamespaceDto {
  @IsNotEmpty()
  name: string
}

export class UpdateNamespaceDto extends AddNamespaceDto {
  @IsNotEmpty()
  id: number
}
