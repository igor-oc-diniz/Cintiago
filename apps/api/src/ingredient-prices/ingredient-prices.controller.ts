import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { IngredientPricesService } from './ingredient-prices.service';
import { CreateIngredientPriceDto } from './dto/create-ingredient-price.dto';
import { UpdateIngredientPriceDto } from './dto/update-ingredient-price.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('ingredient-prices')
export class IngredientPricesController {
  constructor(private readonly ingredientPricesService: IngredientPricesService) {}

  @Roles('OPERATOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.ingredientPricesService.findAll();
  }

  @Roles('OPERATOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  upsertPrice(@Body() createIngredientPriceDto: CreateIngredientPriceDto) {
    return this.ingredientPricesService.upsertPrice(createIngredientPriceDto);
  }

  @Roles('OPERATOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('bulk')
  upsertManyPrices(@Body() dtos: CreateIngredientPriceDto[]) {
    return this.ingredientPricesService.upsertManyPrices(dtos);
  }

  @Roles('OPERATOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':ingredientId')
  findOne(@Param('ingredientId') ingredientId: string) {
    return this.ingredientPricesService.findOne(+ingredientId);
  }

  @Roles('OPERATOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':ingredientId')
  updatePrice(
    @Param('ingredientId') ingredientId: string,
    @Body() dto: UpdateIngredientPriceDto,
  ) {
    return this.ingredientPricesService.updatePrice(+ingredientId, dto);
  }

  @Roles('OPERATOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':ingredientId')
  deletePrice(@Param('ingredientId') ingredientId: string) {
    return this.ingredientPricesService.deletePrice(+ingredientId);
  }
}
