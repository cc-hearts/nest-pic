import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { createWriteStream, existsSync, mkdirSync, readdirSync } from 'fs'
import { join, resolve } from 'path'
import { Repository } from 'typeorm'
import { Upload } from './upload.entity'
import { BaseResponse } from '../../utils/baseResponse'
import { sumSkip } from '../../utils/definePagination'
import { BasePaginationDto } from '../../common/basePagination.dto'
import * as process from 'process'
import { getConfig } from '../../utils'
import { randomUUID } from 'crypto'
import { GetFilePathDto } from './upload.dto'

@Injectable()
export class UploadService {
  constructor(
    @Inject('OSS_FILE')
    private readonly ossFileRepository: Repository<Upload>
  ) {}
  getFormatTime() {
    return new Date().toISOString().split('T')[0]
  }
  getStoredPath(containerKey = '') {
    const date = this.getFormatTime()
    const { folder_name } = getConfig()
    const cwd = process.cwd()
    const folderPath = join(cwd, folder_name, containerKey, date)
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true })
    }
    return folderPath
  }

  saveBinary(file: { buffer: Buffer }, path: string, fileName: string) {
    const filePath = join(path, fileName)
    const writeStream = createWriteStream(filePath)
    writeStream.write(file.buffer)
  }

  saveOssFile(filePath: string, namespace: string) {
    return this.ossFileRepository.save({
      filePath,
      namespace,
    })
  }

  async getFilePath(dto: GetFilePathDto) {
    const data = await this.ossFileRepository.findOne({
      where: { filePath: dto.path },
    })
    if (!data)
      throw new HttpException('文件不存在', HttpStatus.INTERNAL_SERVER_ERROR)
    const { oss_prefix, host, folder_name } = getConfig()
    const url = `${host}/${oss_prefix}/${folder_name}/${data.filePath}`
    return new BaseResponse({ url })
  }

  get columns() {
    return [
      {
        title: 'id',
        key: 'id',
        width: '30%',
        align: 'center',
        fixed: 'left',
        minWidth: '80px',
      },
      {
        title: '附件路径',
        key: 'filePath',
        align: 'center',
        slot: 'filePath',
      },
    ]
  }

  async getUploadFileList(namespace: string, pagination: BasePaginationDto) {
    const [dataSource, total] = await this.ossFileRepository
      .createQueryBuilder('oss')
      .where('oss.namespace = :namespace', { namespace })
      .skip(sumSkip(pagination))
      .take(pagination.pageSize)
      .getManyAndCount()
    return new BaseResponse({
      dataSource,
      total,
      columns: this.columns,
    })
  }

  updateFileName() {
    //
  }

  getFile(path: string) {
    const config = getConfig()
    const namespacePath = resolve(process.cwd(), config.folder_name, path)
    try {
      const files = readdirSync(namespacePath, { withFileTypes: true })
      const set = new Set<string>()
      const filesList: Array<{ name: string; isFile: boolean; id: string }> = []
      files.forEach((file) => {
        let uuid = randomUUID()
        while (set.has(uuid)) {
          uuid = randomUUID()
        }
        set.add(uuid)
        filesList.push({ name: file.name, isFile: file.isFile(), id: uuid })
      })
      return new BaseResponse(filesList, '获取文件列表成功')
    } catch (e) {
      return new BaseResponse([], '文件列表为空')
    }
  }
}
