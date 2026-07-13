import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

describe('OrdersService', () => {
  let service: OrdersService;

  const prisma = {
    client: { findUnique: jest.fn() },
    pizza: { findMany: jest.fn() },
    crust: { findMany: jest.fn() },
    ingredient: { findMany: jest.fn() },
    ingredientPrice: { findMany: jest.fn() },
    product: { findMany: jest.fn() },
    payment: { findUnique: jest.fn() },
    store: { findFirst: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();

    // Baseline: valid client and active payment; entity lists empty (the
    // store-gate assertions below throw before any entity is resolved).
    prisma.client.findUnique.mockResolvedValue({ id: 1, userId: 1 });
    prisma.pizza.findMany.mockResolvedValue([]);
    prisma.crust.findMany.mockResolvedValue([]);
    prisma.ingredient.findMany.mockResolvedValue([]);
    prisma.ingredientPrice.findMany.mockResolvedValue([]);
    prisma.product.findMany.mockResolvedValue([]);
    prisma.payment.findUnique.mockResolvedValue({ id: 1, active: true });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder — store gate', () => {
    // Minimal shape: the store gate fires before any item validation
    const order = {
      paymentId: 1,
      items: [{ size: 'M', halves: [{ pizzaId: 1 }] }],
    } as unknown as CreateOrderDto;

    it('rejects the order when the store is closed', async () => {
      prisma.store.findFirst.mockResolvedValue({ id: 1, isOpen: false });

      await expect(service.createOrder(1, order)).rejects.toThrow(
        new BadRequestException('A loja está fechada no momento'),
      );
    });

    it('passes the gate when the store is open', async () => {
      prisma.store.findFirst.mockResolvedValue({ id: 1, isOpen: true });

      // Proceeds past the gate and fails later on the unknown pizza —
      // proving the closed-store error did not fire.
      await expect(service.createOrder(1, order)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('rejects orders without items', async () => {
      await expect(
        service.createOrder(1, { paymentId: 1, items: [] } as never),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
