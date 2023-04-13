import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { generatorSwaggerDocument } from '../provider/swagger.provider'
import { HttpInterceptor } from '../interceptors/http.interceptor'
import { ExceptionFilters } from '../exceptions/exception.filter'
import { AuthGuard } from '../guards/auth.guard'
import { RedisService } from '../provider/redis.provider'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  })

  generatorSwaggerDocument(app)

  app.useGlobalInterceptors(new HttpInterceptor())

  app.useGlobalPipes(new ValidationPipe())

  app.useGlobalFilters(new ExceptionFilters())

  app.useGlobalGuards(new AuthGuard(app.get(RedisService)))

  await app.listen(3000)
}

bootstrap()
