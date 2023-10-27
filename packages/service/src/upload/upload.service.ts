import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common'
import {createWriteStream, existsSync, mkdirSync, readdirSync, renameSync,} from 'fs'
import {join, resolve} from 'path'
import {Repository} from 'typeorm'
import {Upload} from './upload.entity'
import {BaseResponse} from '../../utils/baseResponse'
import * as process from 'process'
import {getConfig} from '../../utils'
import {randomUUID} from 'crypto'
import {GetFilePathDto, UploadFileNameDto} from './upload.dto'
import {ContainerKeyService} from 'src/container-key/container-key.service'

@Injectable()
export class UploadService {
  constructor(
    @Inject('OSS_FILE')
    private readonly ossFileRepository: Repository<Upload>,
    private readonly containerKeyService: ContainerKeyService
  ) {
  }

  getFormatTime() {
    return new Date().toISOString().split('T')[0]
  }

  getStoredPath(containerKey = '') {
    const date = this.getFormatTime()
    const {folder_name} = getConfig()
    const cwd = process.cwd()
    const folderPath = join(cwd, folder_name, containerKey, date)
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, {recursive: true})
    }
    return folderPath
  }

  saveBinary(file: { buffer: Buffer }, path: string, fileName: string) {
    const filePath = join(path, fileName)
    const writeStream = createWriteStream(filePath)
    writeStream.write(file.buffer)
  }

  async saveOssFile(filePath: string, namespace: string, fileName: string) {
    // 根据namespace 查找相应的id
    const data = await this.containerKeyService.findByNamespace(namespace)
    if (!data) {
      throw new HttpException(
        '命名空间不存在',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
    try {
      return await this.ossFileRepository.save({
        filePath,
        namespaceId: data.id,
        fileName,
      })
    } catch (e) {
      throw new HttpException(
        '保存文件失败',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  getterFilePath(filePath: string) {
    const {oss_prefix, host, folder_name} = getConfig()
    return `${host}/${oss_prefix}/${folder_name}/${filePath}`
  }

  async getFilePath(dto: GetFilePathDto) {
    const data = await this.ossFileRepository.findOne({
      where: {filePath: dto.path},
    })
    if (!data)
      throw new HttpException('文件不存在', HttpStatus.INTERNAL_SERVER_ERROR)
    const url = this.getterFilePath(data.filePath)
    return new BaseResponse({url})
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

  getSavedFilePath(filePath: string) {
    const {folder_name} = getConfig()
    return join(process.cwd(), folder_name, filePath)
  }

  async updateFileName(updateFileNameDto: UploadFileNameDto) {
    const {originFilePath, fileName} = updateFileNameDto
    const data = await this.ossFileRepository.findOne({
      where: {filePath: originFilePath},
    })
    console.log('-----------data',data)
    if (data) {
      let newFilePath: string[] | string = originFilePath
        .split('/')
        .slice(0, -1)
      newFilePath.push(fileName)
      newFilePath = newFilePath.join('/')
      renameSync(
        this.getSavedFilePath(originFilePath),
        this.getSavedFilePath(newFilePath)
      )
      await this.ossFileRepository.update(data.id, {
        filePath: newFilePath,
        fileName,
      })
      return new BaseResponse({url: newFilePath}, '更换名称成功')
    }
  }

  getFile(path: string) {
    const config = getConfig()
    const namespacePath = resolve(process.cwd(), config.folder_name, path)
    try {
      const files = readdirSync(namespacePath, {withFileTypes: true})
      const set = new Set<string>()
      const filesList: Array<{ name: string; isFile: boolean; id: string }> = []
      files.forEach((file) => {
        let uuid = randomUUID()
        while (set.has(uuid)) {
          uuid = randomUUID()
        }
        set.add(uuid)
        filesList.push({name: file.name, isFile: file.isFile(), id: uuid})
      })
      return new BaseResponse(filesList, '获取文件列表成功')
    } catch (e) {
      return new BaseResponse([], '文件列表为空')
    }
  }
}
