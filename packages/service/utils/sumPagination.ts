import { Repository } from 'typeorm'
import { sumSkip } from './definePagination'
import { BasePaginationDto } from 'common/basePagination.dto'

export async function sumPagination<
  P extends BasePaginationDto,
  T extends object
>(
  pagination: P,
  func: Repository<T>,
  cb?: (...args: any) => any
): Promise<[T[], number]> {
  let qb = func.createQueryBuilder().select()
  if (cb instanceof Function) {
    qb = cb(qb)
  }
  return await qb
    .skip(sumSkip(pagination))
    .take(pagination.pageSize)
    .getManyAndCount()
}
