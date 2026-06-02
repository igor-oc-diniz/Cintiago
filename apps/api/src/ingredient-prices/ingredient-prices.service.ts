import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngredientPriceDto } from './dto/create-ingredient-price.dto';
import { UpdateIngredientPriceDto } from './dto/update-ingredient-price.dto';

@Injectable()
export class IngredientPricesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.ingredientPrice.findMany();
  }

  async upsertPrice(dto: CreateIngredientPriceDto) {
    const { ingredientId, priceSmall, priceMedium, priceLarge } = dto;
    return await this.prisma.ingredientPrice.upsert({
      where: { ingredientId },
      create: { ingredientId, priceSmall, priceMedium, priceLarge },
      update: { priceSmall, priceMedium, priceLarge },
    });
  }

  async findOne(ingredientId: number) {
    return await this.prisma.ingredientPrice.findUnique({ where: { ingredientId } });
  }

  async updatePrice(ingredientId: number, dto: UpdateIngredientPriceDto) {
    const { priceSmall, priceMedium, priceLarge } = dto;
    return await this.prisma.ingredientPrice.update({
      where: { ingredientId },
      data: { priceSmall, priceMedium, priceLarge },
    });
  }

  async deletePrice(ingredientId: number) {
    return await this.prisma.ingredientPrice.delete({ where: { ingredientId } });
  }
}
