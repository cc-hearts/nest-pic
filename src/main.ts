import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common'
import { generatorSwaggerDocument } from '../provider/swagger.provider'
import { HttpInterceptor } from '../interceptors/http.interceptor'
import { ExceptionFilters } from '../exceptions/exception.filter'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
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

  const { port } = getConfig()
  app.useStaticAssets(join(__dirname, '..', '..'), { prefix: '/oss/' })
  await app.listen(port)
}

bootstrap()
