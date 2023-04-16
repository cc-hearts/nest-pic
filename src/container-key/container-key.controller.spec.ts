import { Test, TestingModule } from '@nestjs/testing'
import { ContainerKeyController } from './container-key.controller'

describe('ContainerKeyController', () => {
  let controller: ContainerKeyController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContainerKeyController],
    }).compile()

    controller = module.get<ContainerKeyController>(ContainerKeyController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
