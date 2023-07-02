import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { generatorSwaggerDocument } from '../provider/swagger.provider'
import { HttpInterceptor } from '../interceptors/http.interceptor'
import { ExceptionFilters } from '../exceptions/exception.filter'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { urlencoded, json } from 'express'

import { getConfig } from 'utils'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  })

  generatorSwaggerDocument(app)

  app.useGlobalInterceptors(new HttpInterceptor())

  app.useGlobalPipes(new ValidationPipe())

  app.useGlobalFilters(new ExceptionFilters())
  app.use(json({ limit: '50mb' }))
  app.use(urlencoded({ extended: true, limit: '50mb' }))

  const { port, folder_name } = getConfig()
  app.useStaticAssets(join(__dirname, '..', '..', folder_name), {
    prefix: `/oss/${folder_name}/`,
  })
  await app.listen(port)
}

bootstrap()
