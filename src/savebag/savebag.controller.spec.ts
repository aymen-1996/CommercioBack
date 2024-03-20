import { Test, TestingModule } from '@nestjs/testing';
import { SavebagController } from './savebag.controller';

describe('SavebagController', () => {
  let controller: SavebagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavebagController],
    }).compile();

    controller = module.get<SavebagController>(SavebagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
