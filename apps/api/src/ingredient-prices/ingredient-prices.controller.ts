import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { IngredientPricesService } from './ingredient-prices.service';
import { CreateIngredientPriceDto } from './dto/create-ingredient-price.dto';
import { UpdateIngredientPriceDto } from './dto/update-ingredient-price.dto';

@Controller('ingredient-prices')
export class IngredientPricesController {
  constructor(private readonly ingredientPricesService: IngredientPricesService) {}

  @Get()
  findAll() {
    return this.ingredientPricesService.findAll();
  }

  @Post()
  upsertPrice(@Body() createIngredientPriceDto: CreateIngredientPriceDto) {
    return this.ingredientPricesService.upsertPrice(createIngredientPriceDto);
  }

  @Get(':ingredientId')
  findOne(@Param('ingredientId') ingredientId: string) {
    return this.ingredientPricesService.findOne(+ingredientId);
  }

  @Patch(':ingredientId')
  updatePrice(
    @Param('ingredientId') ingredientId: string,
    @Body() dto: UpdateIngredientPriceDto,
  ) {
    return this.ingredientPricesService.updatePrice(+ingredientId, dto);
  }

  @Delete(':ingredientId')
  deletePrice(@Param('ingredientId') ingredientId: string) {
    return this.ingredientPricesService.deletePrice(+ingredientId);
  }
}
