import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ContainerKeyService } from './container-key.service'
import {
  AddNamespaceDto,
  ContainerKeyDto,
  UpdateNamespaceDto,
} from './container-key.dto'
import { BaseResponse } from '../../utils/baseResponse'
import { Profile } from '../../decorators/profile'
import { IUserInfo } from '../../typings'

@Controller('container-key')
export class ContainerKeyController {
  constructor(private readonly containerKeyService: ContainerKeyService) {}
  @Post('genKey')
  genKey(@Profile() user: IUserInfo) {
    const { uid } = user
    return this.containerKeyService.genKey(uid)
  }

  @Post('addNamespace')
  addNamespace(
    @Body() addNamespaceDto: AddNamespaceDto,
    @Profile() user: IUserInfo
  ) {
    const { uid } = user
    return this.containerKeyService.addNamespace(addNamespaceDto, uid)
  }

  @Put('updateNamespace')
  updateNamespace(@Body() updateNamespaceDto: UpdateNamespaceDto) {
    const { id, name } = updateNamespaceDto
    return this.containerKeyService.updateNamespace(id, name)
  }

  @Delete('removeNamespace/:id')
  removeNamespace(@Param() params: { id: number }) {
    const { id } = params
    return this.containerKeyService.removeNamespace(id)
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
        slot: 'action',
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
