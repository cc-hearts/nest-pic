import {
  Controller, Get,
  HttpException,
  HttpStatus,
  Logger, Param,
  Post, Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { type Express } from 'express'
import { UploadService } from './upload.service'
import { join, relative } from 'path'
import { getConfig } from 'utils'
import { ContainerKeyService } from 'src/container-key/container-key.service'
import {BasePaginationDto} from "../../common/basePagination.dto";
@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly containerKeyService: ContainerKeyService
  ) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const path = this.uploadService.getStoredPath()
    const originalName = encodeURIComponent(file.originalname)
    this.uploadService.saveBinary(file, path, originalName)
    const relativePath = relative(process.cwd(), join(path, originalName))
    return { relativePath, status: true }
  }

  @Get('getUploadFileList/:namespace')
  getUploadFileList(@Param() params: { namespace:string }, @Query() pagination: BasePaginationDto) {
      const { namespace } = params
      return this.uploadService.getUploadFileList(namespace,pagination)
  }
  @Post('pic')
  async pic(@Req() request) {
    const { suffix, key, file } = request.body || {}
    let filename = request.body?.filename || ''
    filename = encodeURIComponent(filename)
    Logger.log(`${filename} ${suffix} ${key}`)
    const bool = await this.containerKeyService.validateKey(key)
    if (!bool) return { message: '密钥验证失败' }
    const { oss_prefix, host } = getConfig()
    const path = this.uploadService.getStoredPath(key)
    if (!file)
      throw new HttpException(
        '上传文件不能为空',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    if (!filename)
      throw new HttpException(
        '上传文件名不能为空',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    if (!suffix)
      throw new HttpException(
        '上传文件后缀不能为空',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    const originalName = `${filename}.${suffix}`
    const binaryFile = Buffer.from(file, 'base64')
    this.uploadService.saveBinary({ buffer: binaryFile }, path, originalName)
    const relativePath = relative(process.cwd(), join(path, originalName))
    this.uploadService.saveOssFile(relativePath,key)
    const url = `${host}/${oss_prefix}/${relativePath}`
    Logger.log(url, 'save url:')
    return { url }
  }
}
