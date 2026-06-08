import { Injectable } from '@nestjs/common';
import { CreatePizzaDto } from './dto/create-pizza.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePizzaDto } from './dto/update-pizza.dto';
import { handlePrismaError } from '../common/prisma-errors.helper';

@Injectable()
export class PizzasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.pizza.findMany({
      where: { active: true },
      include: { pizzaIngredients: { include: { ingredient: true } } },
    });
  }

  async createPizza(pizza: CreatePizzaDto) {
    try {
      return await this.prisma.pizza.create({ data: pizza });
    } catch (error) {
      handlePrismaError(error, 'Pizza');
    }
  }

  async createManyPizzas(pizzas: CreatePizzaDto[]) {
    try {
      return await this.prisma.pizza.createMany({ data: pizzas });
    } catch (error) {
      handlePrismaError(error, 'Pizza');
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.pizza.findUniqueOrThrow({
        where: { id },
        include: { pizzaIngredients: { include: { ingredient: true } } },
      });
    } catch (error) {
      handlePrismaError(error, `Pizza ${id}`);
    }
  }

  async updatePizza(id: number, pizza: UpdatePizzaDto) {
    const { name, description, priceSmall, priceMedium, priceLarge, active } =
      pizza;
    try {
      return await this.prisma.pizza.update({
        where: { id },
        data: {
          name,
          description,
          priceSmall,
          priceMedium,
          priceLarge,
          active,
        },
      });
    } catch (error) {
      handlePrismaError(error, `Pizza ${id}`);
    }
  }

  async deletePizza(id: number) {
    try {
      return await this.prisma.pizza.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error, `Pizza ${id}`);
    }
  }
}
