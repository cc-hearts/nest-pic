import { Test, TestingModule } from '@nestjs/testing'
import { ContainerKeyService } from './container-key.service'

describe('ContainerKeyService', () => {
  let service: ContainerKeyService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContainerKeyService],
    }).compile()

    service = module.get<ContainerKeyService>(ContainerKeyService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
