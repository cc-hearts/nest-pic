import { ApiProperty } from '@nestjs/swagger'
import { IsString, ValidateIf } from 'class-validator'

export class BasePaginationDto {
  @IsString()
  @ValidateIf((_, value) => typeof value !== 'number')
  @ApiProperty({
    example: 1,
    description: '页码',
  })
  pageNum?: number

  @IsString()
  @ValidateIf((_, value) => typeof value !== 'number')
  @ApiProperty({
    example: 10,
    description: '页数',
  })
  pageSize?: number
}
