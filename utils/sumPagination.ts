import { Repository } from 'typeorm'
import { sumSkip } from './definePagination'
import { BasePaginationDto } from 'common/basePagination.dto'

export async function sumPagination<
  P extends BasePaginationDto,
  T extends object
>(pagination: P, func: Repository<T>): Promise<[T[], number]> {
  return await func
    .createQueryBuilder()
    .select()
    .skip(sumSkip(pagination))
    .take(pagination.pageSize)
    .getManyAndCount()
}
