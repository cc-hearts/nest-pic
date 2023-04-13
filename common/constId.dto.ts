import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class BaseConstantIdDto {
  @ApiProperty({ example: '1', description: 'id' })
  @IsNotEmpty()
  id: number
}
