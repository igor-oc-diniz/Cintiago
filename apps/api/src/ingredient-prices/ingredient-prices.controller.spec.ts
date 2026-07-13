import { Test, TestingModule } from '@nestjs/testing';
import { IngredientPricesService } from './ingredient-prices.service';
import { IngredientPricesController } from './ingredient-prices.controller';

describe('IngredientPricesController', () => {
  let controller: IngredientPricesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngredientPricesController],
      providers: [{ provide: IngredientPricesService, useValue: {} }],
    }).compile();

    controller = module.get<IngredientPricesController>(
      IngredientPricesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
