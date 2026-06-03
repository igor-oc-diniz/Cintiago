import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientService: IngredientsService) {}

  @Get()
  findAllIngredients() {
    return this.ingredientService.findAll();
  }

  @Roles('OPERATOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  createIngredient(@Body() createIngredient: CreateIngredientDto) {
    return this.ingredientService.createIngredient(createIngredient);
  }

  @Roles('OPERATOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('bulk')
  createManyIngredients(@Body() createIngredients: CreateIngredientDto[]) {
    return this.ingredientService.createManyIngredients(createIngredients);
  }

  @Get(':id')
  findIngredient(@Param('id') id: string) {
    return this.ingredientService.findIngredient(+id);
  }

  @Roles('OPERATOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  updateIngredient(
    @Param('id') id: string,
    @Body() ingredient: UpdateIngredientDto,
  ) {
    return this.ingredientService.updateIngredient(+id, ingredient);
  }

  @Roles('OPERATOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteIngredient(@Param('id') id: string) {
    return this.ingredientService.deleteIngredient(+id);
  }
}
