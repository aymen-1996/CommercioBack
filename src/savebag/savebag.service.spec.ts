import { Test, TestingModule } from '@nestjs/testing';
import { SavebagService } from './savebag.service';

describe('SavebagService', () => {
  let service: SavebagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SavebagService],
    }).compile();

    service = module.get<SavebagService>(SavebagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
