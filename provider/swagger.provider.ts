import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { getPkg } from '../utils'
import { INestApplication } from '@nestjs/common'

function generatorSwaggerConfig() {
  const pkg = getPkg()
  return new DocumentBuilder()
    .setTitle(pkg.name)
    .setDescription(pkg.description)
    .setVersion(pkg.version)
    .build()
}

export function generatorSwaggerDocument(app: INestApplication) {
  const config = generatorSwaggerConfig()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
}
