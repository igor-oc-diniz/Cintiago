import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.ingredient.findMany();
  }

  async createIngredient(ingredient: CreateIngredientDto) {
    return await this.prisma.ingredient.create({ data: ingredient });
  }

  async findIngredient(id: number) {
    return await this.prisma.ingredient.findUnique({ where: { id } });
  }

  async updateIngredient(id: number, ingredient: UpdateIngredientDto) {
    const { name, category } = ingredient;
    return await this.prisma.ingredient.update({
      where: { id },
      data: { name, category },
    });
  }

  async deleteIngredient(id: number) {
    return await this.prisma.ingredient.delete({ where: { id } });
  }
}
