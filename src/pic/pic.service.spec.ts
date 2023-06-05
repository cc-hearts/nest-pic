import { Test, TestingModule } from '@nestjs/testing';
import { PicService } from './pic.service';

describe('PicService', () => {
  let service: PicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PicService],
    }).compile();

    service = module.get<PicService>(PicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
