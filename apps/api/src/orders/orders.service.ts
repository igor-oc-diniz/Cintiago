import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Decimal } from '@prisma/client/runtime/client';

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

  async createOrder(order: CreateOrderDto) {
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

    const [pizzas, crusts, ingredientPrices, products] = await Promise.all([
      this.prisma.pizza.findMany({ where: { id: { in: pizzaIds } } }),
      this.prisma.crust.findMany({ where: { id: { in: crustIds } } }),
      this.prisma.ingredientPrice.findMany({
        where: { ingredientId: { in: ingredientIds } },
      }),
      this.prisma.product.findMany({ where: { id: { in: productIds } } }),
    ]);

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
        if (!pizza) throw new Error(`Pizza ${half.pizzaId} não encontrada`);

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
        if (crust) crustPrice = this.getPrice(crust, item.size);
      }

      total += (pizzaPrice + crustPrice) * item.quantity;
    }

    for (const orderProduct of order.products ?? []) {
      const product = productMap.get(orderProduct.productId);
      if (!product)
        throw new Error(`Produto ${orderProduct.productId} não encontrado`);
      total += Number(product.price) * orderProduct.quantity;
    }

    const createdOrder = await this.prisma.$transaction(async (tx) => {
      // Create the order to have the ID
      const newOrder = await tx.order.create({
        data: {
          clientId: order.clientId,
          paymentId: order.paymentId,
          total,
        },
      });

      // With the order ID, we create the items of the order
      for (const item of order.items) {
        const newItem = await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            crustId: item.crustId,
            size: item.size,
            quantity: item.quantity,
          },
        });

        // Creates the pizza flavor into the order
        for (const half of item.halves) {
          const newHalf = await tx.orderItemHalf.create({
            data: {
              orderItemId: newItem.id,
              pizzaId: half.pizzaId,
              half: half.half,
            },
          });

          // Adds the extra ingredients to the order
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

      // Creates the relation of the order with the products
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
  }
}
