import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { PizzasService } from './pizzas.service';

describe('PizzasService', () => {
  let service: PizzasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PizzasService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<PizzasService>(PizzasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
