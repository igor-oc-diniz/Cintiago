import { Test, TestingModule } from '@nestjs/testing';
import { PizzasService } from './pizzas.service';
import { PizzasController } from './pizzas.controller';

describe('PizzasController', () => {
  let controller: PizzasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PizzasController],
      providers: [{ provide: PizzasService, useValue: {} }],
    }).compile();

    controller = module.get<PizzasController>(PizzasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
