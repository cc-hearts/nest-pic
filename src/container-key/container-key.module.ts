import { Module } from '@nestjs/common';
import { ContainerKeyController } from './container-key.controller';
import { ContainerKeyService } from './container-key.service';
import { containerKeyProvider } from './container-key.provider';

@Module({
  controllers: [ContainerKeyController],
  providers: [...containerKeyProvider, ContainerKeyService],
  exports: [...containerKeyProvider, ContainerKeyService]
})
export class ContainerKeyModule { }
