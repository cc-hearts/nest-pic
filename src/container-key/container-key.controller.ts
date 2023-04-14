import { Controller, Post } from '@nestjs/common';
import { ContainerKeyService } from './container-key.service';

@Controller('container-key')
export class ContainerKeyController {

  constructor(
    private readonly containerKeyService: ContainerKeyService
  ) { }
  @Post('genKey')
  genKey() {
    return this.containerKeyService.genKey();
  }

}
