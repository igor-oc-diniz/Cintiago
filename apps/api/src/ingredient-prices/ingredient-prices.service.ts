import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngredientPriceDto } from './dto/create-ingredient-price.dto';
import { CreateIngredientWithPriceDto } from './dto/create-ingredient-with-price.dto';
import { UpdateIngredientPriceDto } from './dto/update-ingredient-price.dto';
import { handlePrismaError } from '../common/prisma-errors.helper';

@Injectable()
export class IngredientPricesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.ingredientPrice.findMany();
  }

  async upsertManyPrices(dtos: CreateIngredientPriceDto[]) {
    try {
      return await Promise.all(dtos.map((dto) => this.upsertPrice(dto)));
    } catch (error) {
      handlePrismaError(error, 'IngredientPrice');
    }
  }

  async upsertPrice(dto: CreateIngredientPriceDto) {
    const { ingredientId, priceSmall, priceMedium, priceLarge } = dto;
    try {
      return await this.prisma.ingredientPrice.upsert({
        where: { ingredientId },
        create: { ingredientId, priceSmall, priceMedium, priceLarge },
        update: { priceSmall, priceMedium, priceLarge },
      });
    } catch (error) {
      handlePrismaError(error, 'IngredientPrice');
    }
  }

  async createIngredientWithPrice(ingredient: CreateIngredientWithPriceDto) {
    const { name, category, priceSmall, priceMedium, priceLarge } = ingredient;
    try {
      return await this.prisma.$transaction(async (tx) => {
        const ingredient = await tx.ingredient.create({
          data: { name, category },
        });
        const price = await tx.ingredientPrice.create({
          data: {
            ingredientId: ingredient.id,
            priceSmall,
            priceMedium,
            priceLarge,
          },
        });
        return { ...ingredient, price };
      });
    } catch (error) {
      handlePrismaError(error, 'Ingredient');
    }
  }

  async createManyIngredientsWithPrice(
    ingredients: CreateIngredientWithPriceDto[],
  ) {
    try {
      return await Promise.all(
        ingredients.map((ingredient) =>
          this.createIngredientWithPrice(ingredient),
        ),
      );
    } catch (error) {
      handlePrismaError(error, 'Ingredient');
    }
  }

  async findOne(ingredientId: number) {
    try {
      return await this.prisma.ingredientPrice.findUniqueOrThrow({
        where: { ingredientId },
      });
    } catch (error) {
      handlePrismaError(
        error,
        `IngredientPrice for ingredient ${ingredientId}`,
      );
    }
  }

  async updatePrice(ingredientId: number, dto: UpdateIngredientPriceDto) {
    const { priceSmall, priceMedium, priceLarge } = dto;
    try {
      return await this.prisma.ingredientPrice.update({
        where: { ingredientId },
        data: { priceSmall, priceMedium, priceLarge },
      });
    } catch (error) {
      handlePrismaError(
        error,
        `IngredientPrice for ingredient ${ingredientId}`,
      );
    }
  }

  async deletePrice(ingredientId: number) {
    try {
      return await this.prisma.ingredientPrice.delete({
        where: { ingredientId },
      });
    } catch (error) {
      handlePrismaError(
        error,
        `IngredientPrice for ingredient ${ingredientId}`,
      );
    }
  }
}
