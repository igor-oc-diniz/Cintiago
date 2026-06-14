import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
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

  private computeEta(
    order: {
      deliveryType: string;
      orderItems: { quantity: number }[];
    },
    store: {
      basePrepMinutes: number;
      perPizzaMinutes: number;
      deliveryMinutes: number;
    } | null,
  ): number | null {
    if (!store) return null;

    const totalPizzas = order.orderItems.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );
    const delivery =
      order.deliveryType === 'delivery' ? store.deliveryMinutes : 0;

    return (
      store.basePrepMinutes + store.perPizzaMinutes * totalPizzas + delivery
    );
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
    const [orders, store] = await Promise.all([
      this.prisma.order.findMany({
        include: this.orderInclude,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.store.findFirst(),
    ]);

    return orders.map((order) => ({
      ...order,
      estimatedDeliveryMinutes: this.computeEta(order, store),
    }));
  }

  async findOne(id: number) {
    try {
      const [order, store] = await Promise.all([
        this.prisma.order.findUniqueOrThrow({
          where: { id },
          include: this.orderInclude,
        }),
        this.prisma.store.findFirst(),
      ]);

      return {
        ...order,
        estimatedDeliveryMinutes: this.computeEta(order, store),
      };
    } catch (error) {
      handlePrismaError(error, `Pedido ${id}`);
    }
  }

  async updateStatus(id: number, status: OrderStatus) {
    if (!status) throw new BadRequestException('O campo status é obrigatório');

    const validStatuses = Object.values(OrderStatus);
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
    const itemUnitPrices = new Map<(typeof order.items)[number], number>();

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
          if (!chargedIngredients.has(ing.ingredientId)) {
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

      const unitPrice = pizzaPrice + crustPrice;
      itemUnitPrices.set(item, unitPrice);

      total += unitPrice * item.quantity;
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
            deliveryType: order.deliveryType,
          },
        });

        for (const item of order.items) {
          const newItem = await tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              crustId: item.crustId,
              size: item.size,
              quantity: item.quantity,
              price: itemUnitPrices.get(item),
              notes: item.notes,
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

        return newOrder.id;
      });

      const [newOrder, store] = await Promise.all([
        this.prisma.order.findUnique({
          where: { id: createdOrder },
          include: this.orderInclude,
        }),
        this.prisma.store.findFirst(),
      ]);

      if (!newOrder) return newOrder;

      return {
        ...newOrder,
        estimatedDeliveryMinutes: this.computeEta(newOrder, store),
      };
    } catch (error) {
      handlePrismaError(error, 'Pedido');
    }
  }

  async findMyOrders(userId: number) {
    try {
      const currentClient = await this.prisma.client.findUniqueOrThrow({
        where: { userId },
      });

      const [orders, store] = await Promise.all([
        this.prisma.order.findMany({
          where: { clientId: currentClient.id },
          include: this.orderInclude,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.store.findFirst(),
      ]);

      return orders.map((order) => ({
        ...order,
        estimatedDeliveryMinutes: this.computeEta(order, store),
      }));
    } catch (error) {
      handlePrismaError(error, 'Cliente');
    }
  }

  async findMyOrderById(userId: number, orderId: number) {
    try {
      const currentClient = await this.prisma.client.findUniqueOrThrow({
        where: { userId },
      });

      const [order, store] = await Promise.all([
        this.prisma.order.findUniqueOrThrow({
          where: { id: orderId, clientId: currentClient.id },
          include: this.orderInclude,
        }),
        this.prisma.store.findFirst(),
      ]);

      return {
        ...order,
        estimatedDeliveryMinutes: this.computeEta(order, store),
      };
    } catch (error) {
      handlePrismaError(error, `Pedido ${orderId}`);
    }
  }
}
