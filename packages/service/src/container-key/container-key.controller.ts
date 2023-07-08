import {Body, Controller, Get, Post, Query} from '@nestjs/common'
import { ContainerKeyService } from './container-key.service'
import {AddNamespaceDto, ContainerKeyDto} from './container-key.dto'
import { BaseResponse } from '../../utils/baseResponse'
import {Profile} from "../../decorators/profile";
import {IUserInfo} from "../../typings";

@Controller('container-key')
export class ContainerKeyController {
  constructor(private readonly containerKeyService: ContainerKeyService) {}
  @Post('genKey')
  genKey(@Profile() user: IUserInfo) {
    const { uid } = user
    return this.containerKeyService.genKey(uid)
  }

  @Post('addNamespace')
  addNamespace(@Body() addNamespaceDto: AddNamespaceDto, @Profile() user: IUserInfo) {
    const { uid } = user
    return this.containerKeyService.addNamespace(addNamespaceDto, uid)
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
      {
        title: '操作',
        key: 'action',
        align: 'center',
        slot: 'action'
      }
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
