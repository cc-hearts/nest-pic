import { Controller, Get, Post, Query } from '@nestjs/common'
import { ContainerKeyService } from './container-key.service'
import { ContainerKeyDto } from './container-key.dto'
import { BaseResponse } from '../../utils/baseResponse'

@Controller('container-key')
export class ContainerKeyController {
  constructor(private readonly containerKeyService: ContainerKeyService) {}
  @Post('genKey')
  genKey() {
    return this.containerKeyService.genKey()
  }

  get columns() {
    return [
      { title: 'id', key: 'id', width: '30%', align: 'center' },
      {
        title: '命名空间',
        key: 'containerKey',
        align: 'center',
        slot: 'containerKey',
      },
    ]
  }

  @Get('getPicList')
  async getPicList(@Query() containerKeyDto: ContainerKeyDto) {
    const [dataSource, total] = await this.containerKeyService.getPicList(
      containerKeyDto
    )
    return new BaseResponse({
      columns: this.columns,
      dataSource,
      total,
    })
  }
}
