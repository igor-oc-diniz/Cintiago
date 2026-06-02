import { Test, TestingModule } from '@nestjs/testing';
import { IngredientPricesService } from './ingredient-prices.service';

describe('IngredientPricesService', () => {
  let service: IngredientPricesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngredientPricesService],
    }).compile();

    service = module.get<IngredientPricesService>(IngredientPricesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
