import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common'
import { Repository } from 'typeorm'
import { ContainerKey } from './container-key.entity'
import { nanoid } from 'nanoid'
import { isProd } from 'utils'
import {AddNamespaceDto, ContainerKeyDto} from './container-key.dto'
import { sumPagination } from '../../utils/sumPagination'
import {BaseResponse} from "../../utils/baseResponse";

@Injectable()
export class ContainerKeyService {
  constructor(
    @Inject('CONTAINER_KEY')
    private readonly containerKeyRepository: Repository<ContainerKey>
  ) {}
  async genKey(uid: number) {
    if (isProd()) return { message: 'production mode is not generator key' }
    let id = nanoid()
    while (
      await this.containerKeyRepository.findOne({ where: { containerKey: id, uid } })
    ) {
      id = nanoid()
    }
    return this.containerKeyRepository.save({
      containerKey: id,
      uid
    })
  }

  async addNamespace(dto: AddNamespaceDto, id: number) {
    const { name: containerKey } = dto
    const namespaces = await this.containerKeyRepository.findOne({
      where: {
        containerKey,
        uid: id
      }
    })

    if (namespaces) {
      throw new HttpException("命名空间已存在", HttpStatus.INTERNAL_SERVER_ERROR)
    }

    await this.containerKeyRepository.save({
      containerKey,
      uid: id
    })
    return new BaseResponse(null, "命名空间添加成功")
  }
  async validateKey(key: string) {
    if (
      await this.containerKeyRepository.findOne({
        where: { containerKey: key },
      })
    ) {
      return true
    }
    return false
  }

  async getPicList(pagination: ContainerKeyDto) {
    return await sumPagination(pagination, this.containerKeyRepository)
  }
}
