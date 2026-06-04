import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Decimal } from '@prisma/client/runtime/client';
import { handlePrismaError } from '../common/prisma-errors.helper';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private getPrice(
    pizzaValue: {
      priceSmall?: Decimal | null;
      priceMedium?: Decimal | null;
      priceLarge?: Decimal | null;
    },
    size: string,
  ): number {
    const price =
      size === 'small'
        ? pizzaValue.priceSmall
        : size === 'medium'
          ? pizzaValue.priceMedium
          : pizzaValue.priceLarge;

    return Number(price ?? 0);
  }

  private readonly orderInclude = {
    client: true,
    payment: true,
    orderItems: {
      include: {
        crust: true,
        halves: {
          include: {
            pizza: true,
            ingredients: { include: { ingredient: true } },
          },
        },
      },
    },
    orderProducts: { include: { product: true } },
  };

  async findAll() {
    return this.prisma.order.findMany({
      include: this.orderInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    try {
      return await this.prisma.order.findUniqueOrThrow({
        where: { id },
        include: this.orderInclude,
      });
    } catch (error) {
      handlePrismaError(error, `Pedido ${id}`);
    }
  }

  async updateStatus(id: number, status: string) {
    if (!status) throw new BadRequestException('O campo status é obrigatório');

    const validStatuses = ['pending', 'confirmed', 'delivered'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(
        `Status inválido. Use: ${validStatuses.join(', ')}`,
      );
    }

    try {
      return await this.prisma.order.update({
        where: { id },
        data: { status },
      });
    } catch (error) {
      handlePrismaError(error, `Pedido ${id}`);
    }
  }

  async createOrder(userId: number, order: CreateOrderDto) {
    if (!order.items || order.items.length === 0) {
      throw new BadRequestException('O pedido deve ter ao menos um item');
    }

    const pizzaIds = [
      ...new Set(
        order.items.flatMap((item) => item.halves).map((half) => half.pizzaId),
      ),
    ];

    const crustIds = [
      ...new Set(
        order.items
          .filter((item) => item.crustId)
          .map((item) => item.crustId as number),
      ),
    ];

    const ingredientIds = [
      ...new Set(
        order.items
          .flatMap((item) => item.halves)
          .flatMap((half) => half.ingredients ?? [])
          .filter((ing) => ing.action === 'add')
          .map((ing) => ing.ingredientId),
      ),
    ];

    const productIds = (order.products ?? []).map((p) => p.productId);

    const [client, pizzas, crusts, ingredientPrices, products] =
      await Promise.all([
        this.prisma.client.findUnique({ where: { userId: userId } }),
        this.prisma.pizza.findMany({ where: { id: { in: pizzaIds } } }),
        this.prisma.crust.findMany({ where: { id: { in: crustIds } } }),
        this.prisma.ingredientPrice.findMany({
          where: { ingredientId: { in: ingredientIds } },
        }),
        this.prisma.product.findMany({ where: { id: { in: productIds } } }),
      ]);

    if (!client) throw new NotFoundException(`Cliente nao encontrado`);

    const pizzaMap = new Map(pizzas.map((p) => [p.id, p]));
    const crustsMap = new Map(crusts.map((c) => [c.id, c]));
    const ingredientMap = new Map(
      ingredientPrices.map((i) => [i.ingredientId, i]),
    );
    const productMap = new Map(products.map((p) => [p.id, p]));

    let total = 0;

    for (const item of order.items) {
      const halfPrices: number[] = [];
      const chargedIngredients = new Set<number>();

      for (const half of item.halves) {
        const pizza = pizzaMap.get(half.pizzaId);
        if (!pizza)
          throw new NotFoundException(`Pizza ${half.pizzaId} não encontrada`);
        if (!pizza.active)
          throw new BadRequestException(
            `Pizza ${half.pizzaId} está inativa e não pode ser pedida`,
          );

        let halfPrice = this.getPrice(pizza, item.size);

        for (const ing of half.ingredients ?? []) {
          if (
            ing.action === 'add' &&
            !chargedIngredients.has(ing.ingredientId)
          ) {
            const ip = ingredientMap.get(ing.ingredientId);
            if (ip) halfPrice += this.getPrice(ip, item.size);
            chargedIngredients.add(ing.ingredientId);
          }
        }

        halfPrices.push(halfPrice);
      }

      const pizzaPrice = Math.max(...halfPrices);

      let crustPrice = 0;
      if (item.crustId) {
        const crust = crustsMap.get(item.crustId);
        if (!crust)
          throw new NotFoundException(`Borda ${item.crustId} nao encontrada`);
        if (!crust.active)
          throw new BadRequestException(`Borda ${item.crustId} esta inativa`);
        crustPrice = this.getPrice(crust, item.size);
      }

      total += (pizzaPrice + crustPrice) * item.quantity;
    }

    for (const orderProduct of order.products ?? []) {
      const product = productMap.get(orderProduct.productId);
      if (!product)
        throw new NotFoundException(
          `Produto ${orderProduct.productId} nao encontrado`,
        );
      if (!product.active)
        throw new BadRequestException(
          `Produto ${orderProduct.productId} esta inativo`,
        );
      total += Number(product.price) * orderProduct.quantity;
    }

    try {
      const createdOrder = await this.prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            clientId: client.id,
            paymentId: order.paymentId,
            total,
          },
        });

        for (const item of order.items) {
          const newItem = await tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              crustId: item.crustId,
              size: item.size,
              quantity: item.quantity,
            },
          });

          for (const half of item.halves) {
            const newHalf = await tx.orderItemHalf.create({
              data: {
                orderItemId: newItem.id,
                pizzaId: half.pizzaId,
                half: half.half,
              },
            });

            for (const ing of half.ingredients ?? []) {
              await tx.orderItemHalfIngredient.create({
                data: {
                  orderItemHalfId: newHalf.id,
                  ingredientId: ing.ingredientId,
                  action: ing.action,
                },
              });
            }
          }
        }

        for (const orderProduct of order.products ?? []) {
          await tx.orderProduct.create({
            data: {
              orderId: newOrder.id,
              productId: orderProduct.productId,
              quantity: orderProduct.quantity,
            },
          });
        }

        return newOrder;
      });

      return createdOrder;
    } catch (error) {
      handlePrismaError(error, 'Pedido');
    }
  }

  async findMyOrders(userId: number) {
    try {
      const currentClient = await this.prisma.client.findUniqueOrThrow({
        where: { userId },
      });

      return await this.prisma.order.findMany({
        where: { clientId: currentClient.id },
      });
    } catch (error) {
      handlePrismaError(error, 'Cliente');
    }
  }
}
