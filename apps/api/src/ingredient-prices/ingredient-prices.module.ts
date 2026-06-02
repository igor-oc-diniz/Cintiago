import { Module } from '@nestjs/common';
import { IngredientPricesController } from './ingredient-prices.controller';
import { IngredientPricesService } from './ingredient-prices.service';

@Module({
  controllers: [IngredientPricesController],
  providers: [IngredientPricesService]
})
export class IngredientPricesModule {}
