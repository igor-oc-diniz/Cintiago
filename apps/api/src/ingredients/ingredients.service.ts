import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { handlePrismaError } from '../common/prisma-errors.helper';

@Injectable()
export class IngredientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.ingredient.findMany();
  }

  async createIngredient(ingredient: CreateIngredientDto) {
    try {
      return await this.prisma.ingredient.create({ data: ingredient });
    } catch (error) {
      handlePrismaError(error, 'Ingredient');
    }
  }

  async findIngredient(id: number) {
    try {
      return await this.prisma.ingredient.findUniqueOrThrow({ where: { id } });
    } catch (error) {
      handlePrismaError(error, `Ingredient ${id}`);
    }
  }

  async updateIngredient(id: number, ingredient: UpdateIngredientDto) {
    const { name, category } = ingredient;
    try {
      return await this.prisma.ingredient.update({
        where: { id },
        data: { name, category },
      });
    } catch (error) {
      handlePrismaError(error, `Ingredient ${id}`);
    }
  }

  async deleteIngredient(id: number) {
    try {
      return await this.prisma.ingredient.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error, `Ingredient ${id}`);
    }
  }
}
