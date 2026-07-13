import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { IngredientPricesService } from './ingredient-prices.service';

describe('IngredientPricesService', () => {
  let service: IngredientPricesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientPricesService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<IngredientPricesService>(IngredientPricesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
