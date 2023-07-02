import { Inject, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { ContainerKey } from './container-key.entity'
import { nanoid } from 'nanoid'
import { isProd } from 'utils'
import { ContainerKeyDto } from './container-key.dto'
import { sumPagination } from '../../utils/sumPagination'
@Injectable()
export class ContainerKeyService {
  constructor(
    @Inject('CONTAINER_KEY')
    private readonly containerKeyRepository: Repository<ContainerKey>
  ) {}
  async genKey() {
    if (isProd()) return { message: 'production mode is not generator key' }
    let id = nanoid()
    while (
      await this.containerKeyRepository.findOne({ where: { containerKey: id } })
    ) {
      id = nanoid()
    }
    return this.containerKeyRepository.save({
      containerKey: id,
    })
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
