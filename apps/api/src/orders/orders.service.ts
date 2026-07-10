import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, DeliveryType, PizzaSize } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/client';
import { handlePrismaError } from '../common/prisma-errors.helper';
import { CreateRatingDto } from './dto/create-rating.dto';
import { ReplyRatingDto } from './dto/reply-rating.dto';
import { FindOrdersQueryDto } from './dto/find-orders-query.dto';
import { FindOrdersAdminQueryDto } from './dto/find-orders-admin-query.dto';
import type { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private buildOrderWhere(
    query: FindOrdersAdminQueryDto,
    clientId?: number,
  ): Prisma.OrderWhereInput {
    const where: Prisma.OrderWhereInput = {};

    if (clientId !== undefined) where.clientId = clientId;
    else if (query.clientId !== undefined) where.clientId = query.clientId;

    if (query.status) where.status = query.status;

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) {
        // inclui o dia inteiro quando vier apenas a data (sem horário)
        const end = new Date(query.endDate);
        if (/^\d{4}-\d{2}-\d{2}$/.test(query.endDate)) {
          end.setUTCHours(23, 59, 59, 999);
        }
        where.createdAt.lte = end;
      }
    }

    return where;
  }

  private buildPaginationMeta(total: number, page: number, limit: number) {
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
    return {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  private getPrice(
    pizzaValue: {
      priceSmall?: Decimal | null;
      priceMedium?: Decimal | null;
      priceLarge?: Decimal | null;
    },
    size: PizzaSize,
  ): number {
    const price =
      size === 'small'
        ? pizzaValue.priceSmall
        : size === 'medium'
          ? pizzaValue.priceMedium
          : pizzaValue.priceLarge;

    if (price == null) {
      throw new BadRequestException(
        `Item sem preço cadastrado para o tamanho "${size}"`,
      );
    }
    return Number(price);
  }

  private computeEta(
    order: {
      deliveryType: DeliveryType;
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
    rating: true,
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

  async findAll(query: FindOrdersAdminQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where = this.buildOrderWhere(query);

    const [orders, total, store] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: this.orderInclude,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
      this.prisma.store.findFirst(),
    ]);

    return {
      data: orders.map((order) => ({
        ...order,
        estimatedDeliveryMinutes: this.computeEta(order, store),
      })),
      meta: this.buildPaginationMeta(total, page, limit),
    };
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

    const [
      client,
      pizzas,
      crusts,
      ingredients,
      ingredientPrices,
      products,
      payment,
      store,
    ] = await Promise.all([
      this.prisma.client.findUnique({ where: { userId: userId } }),
      this.prisma.pizza.findMany({ where: { id: { in: pizzaIds } } }),
      this.prisma.crust.findMany({ where: { id: { in: crustIds } } }),
      this.prisma.ingredient.findMany({ where: { id: { in: ingredientIds } } }),
      this.prisma.ingredientPrice.findMany({
        where: { ingredientId: { in: ingredientIds } },
      }),
      this.prisma.product.findMany({ where: { id: { in: productIds } } }),
      this.prisma.payment.findUnique({ where: { id: order.paymentId } }),
      this.prisma.store.findFirst(),
    ]);

    if (!client) throw new NotFoundException(`Cliente nao encontrado`);

    if (!payment)
      throw new NotFoundException(
        `Pagamento ${order.paymentId} nao encontrado`,
      );
    if (!payment.active)
      throw new BadRequestException(
        `Pagamento ${order.paymentId} esta inativo`,
      );

    if (store && !store.isOpen)
      throw new BadRequestException('A loja está fechada no momento');

    const pizzaMap = new Map(pizzas.map((p) => [p.id, p]));
    const crustsMap = new Map(crusts.map((c) => [c.id, c]));
    const ingredientStatusMap = new Map(ingredients.map((i) => [i.id, i]));
    const ingredientMap = new Map(
      ingredientPrices.map((i) => [i.ingredientId, i]),
    );
    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
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
          const ingredient = ingredientStatusMap.get(ing.ingredientId);
          if (!ingredient)
            throw new NotFoundException(
              `Ingrediente ${ing.ingredientId} não encontrado`,
            );
          if (!ingredient.active)
            throw new BadRequestException(
              `Ingrediente ${ing.ingredientId} está inativo e não pode ser pedido`,
            );

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

      subtotal += unitPrice * item.quantity;
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
      subtotal += Number(product.price) * orderProduct.quantity;
    }

    const deliveryFee =
      order.deliveryType === 'delivery' ? Number(store?.deliveryFee ?? 0) : 0;
    const total = subtotal + deliveryFee;

    // Troco só faz sentido para pagamento em dinheiro: nos demais métodos é
    // ignorado silenciosamente. Quando em dinheiro, precisa cobrir o total.
    let changeFor: number | null = null;
    if (payment.type === 'CASH' && order.changeFor != null) {
      if (order.changeFor < total) {
        throw new BadRequestException(
          'O valor do troco não pode ser menor que o total do pedido',
        );
      }
      changeFor = order.changeFor;
    }

    try {
      const createdOrder = await this.prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            clientId: client.id,
            paymentId: order.paymentId,
            subtotal,
            deliveryFee,
            total,
            changeFor,
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

      const newOrder = await this.prisma.order.findUnique({
        where: { id: createdOrder },
        include: this.orderInclude,
      });

      if (!newOrder) return newOrder;

      return {
        ...newOrder,
        estimatedDeliveryMinutes: this.computeEta(newOrder, store),
      };
    } catch (error) {
      handlePrismaError(error, 'Pedido');
    }
  }

  async findMyOrders(userId: number, query: FindOrdersQueryDto) {
    try {
      const currentClient = await this.prisma.client.findUniqueOrThrow({
        where: { userId },
      });

      const page = query.page ?? 1;
      const limit = query.limit ?? 20;
      const where = this.buildOrderWhere(query, currentClient.id);

      const [orders, total, store] = await Promise.all([
        this.prisma.order.findMany({
          where,
          include: this.orderInclude,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.order.count({ where }),
        this.prisma.store.findFirst(),
      ]);

      return {
        data: orders.map((order) => ({
          ...order,
          estimatedDeliveryMinutes: this.computeEta(order, store),
        })),
        meta: this.buildPaginationMeta(total, page, limit),
      };
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
  async rateOrder(userId: number, orderId: number, dto: CreateRatingDto) {
    const client = await this.prisma.client.findUnique({ where: { userId } });
    if (!client) throw new NotFoundException('Cliente não encontrado');
    const order = await this.prisma.order.findUnique({
      where: { id: orderId, clientId: client.id },
    });
    if (!order) throw new NotFoundException(`Pedido ${orderId} não encontrado`);
    if (order.status !== 'delivered') {
      throw new BadRequestException('Só é possível avaliar pedidos entregues');
    }
    try {
      return this.prisma.rating.upsert({
        where: { orderId },
        create: { orderId, stars: dto.stars, comment: dto.comment },
        update: { stars: dto.stars, comment: dto.comment },
      });
    } catch (error) {
      handlePrismaError(error, `Avaliação do pedido ${orderId}`);
    }
  }

  async replyToRating(orderId: number, dto: ReplyRatingDto) {
    const rating = await this.prisma.rating.findUnique({ where: { orderId } });
    if (!rating)
      throw new NotFoundException(
        `Avaliação do pedido ${orderId} não encontrada`,
      );
    try {
      return this.prisma.rating.update({
        where: { orderId },
        data: { reply: dto.reply },
      });
    } catch (error) {
      handlePrismaError(error, `Avaliação do pedido ${orderId}`);
    }
  }
}
