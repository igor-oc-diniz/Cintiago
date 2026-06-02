import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngredientPriceDto } from './dto/create-ingredient-price.dto';
import { UpdateIngredientPriceDto } from './dto/update-ingredient-price.dto';
import { handlePrismaError } from '../common/prisma-errors.helper';

@Injectable()
export class IngredientPricesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.ingredientPrice.findMany();
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
