import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UploadFileNameDto {
  @ApiProperty({ description: '文件名称' })
  @IsNotEmpty()
  fileName: string

  @ApiProperty({ description: '文件id' })
  @IsNotEmpty()
  id: string
}

export class GetFileDto {
  // 文件路径
  @IsNotEmpty()
  path: string
}

export class GetFilePathDto {
  @IsNotEmpty()
  path: string
}
