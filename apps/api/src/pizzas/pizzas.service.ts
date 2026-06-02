import { Injectable } from '@nestjs/common';
import { CreatePizzaDto } from './dto/create-pizza.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePizzaDto } from './dto/update-pizza.dto';

@Injectable()
export class PizzasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.pizza.findMany({
      where: { active: true },
    });
  }

  async createPizza(pizza: CreatePizzaDto) {
    return await this.prisma.pizza.create({ data: pizza });
  }

  async findOne(id: number) {
    return await this.prisma.pizza.findUnique({ where: { id } });
  }

  async updatePizza(id: number, pizza: UpdatePizzaDto) {
    const { name, description, priceSmall, priceMedium, priceLarge, active } =
      pizza;
    return await this.prisma.pizza.update({
      where: { id },
      data: { name, description, priceSmall, priceMedium, priceLarge, active },
    });
  }

  async deletePizza(id: number) {
    return await this.prisma.pizza.delete({ where: { id } });
  }
}
