import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { ContainerKey, REMOVE_FLAG } from './container-key.entity'
import { nanoid } from 'nanoid'
import { isProd } from 'utils'
import { AddNamespaceDto, ContainerKeyDto } from './container-key.dto'
import { sumPagination } from '../../utils/sumPagination'
import { BaseResponse } from '../../utils/baseResponse'

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
      await this.containerKeyRepository.findOne({
        where: { containerKey: id, uid },
      })
    ) {
      id = nanoid()
    }
    return this.containerKeyRepository.save({
      containerKey: id,
      uid,
    })
  }

  async updateNamespace(id: number, name: string) {
    await this.containerKeyRepository
      .createQueryBuilder()
      .update()
      .set({ containerKey: name })
      .where('id = :id', { id })
      .execute()

    return new BaseResponse(null, '更新成功')
  }

  async addNamespace(dto: AddNamespaceDto, id: number) {
    const { name: containerKey } = dto
    const namespaces = await this.containerKeyRepository.findOne({
      where: {
        containerKey,
        uid: id,
      },
    })

    if (namespaces) {
      if (namespaces.removeFlag === REMOVE_FLAG.UN_REMOVE) {
        throw new HttpException(
          '命名空间已存在',
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      } else {
        await this.containerKeyRepository
          .createQueryBuilder()
          .update()
          .set({ removeFlag: REMOVE_FLAG.UN_REMOVE })
          .where('container_key = :containerKey AND uid = :uid', {
            containerKey,
            uid: id,
          })
          .execute()
      }
    } else {
      await this.containerKeyRepository.save({
        containerKey,
        uid: id,
      })
    }
    return new BaseResponse(null, '命名空间添加成功')
  }

  async removeNamespace(id: number) {
    await this.containerKeyRepository
      .createQueryBuilder()
      .update()
      .set({ removeFlag: REMOVE_FLAG.REMOVE })
      .where('id = :id', { id })
      .execute()
    return new BaseResponse(null, '删除命名空间成功')
  }
  async validateKey(key: string) {
    return !!(await this.containerKeyRepository.findOne({
      where: { containerKey: key },
    }))
  }

  async getPicList(pagination: ContainerKeyDto) {
    return await sumPagination(
      pagination,
      this.containerKeyRepository,
      (db) => {
        db = db.where('remove_flag = :removeFlag', {
          removeFlag: REMOVE_FLAG.UN_REMOVE,
        })
        return db
      }
    )
  }

  async findByNamespace(namespace: string) {
    return await this.containerKeyRepository.findOne({
      where: { containerKey: namespace },
    })
  }
}
