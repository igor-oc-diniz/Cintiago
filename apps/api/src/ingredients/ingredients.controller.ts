import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientService: IngredientsService) {}

  @Get()
  findAllIngredients() {
    return this.ingredientService.findAll();
  }

  @Post()
  createIngredient(@Body() createIngredient: CreateIngredientDto) {
    return this.ingredientService.createIngredient(createIngredient);
  }

  @Get(':id')
  findIngredient(@Param('id') id: string) {
    return this.ingredientService.findIngredient(+id);
  }

  @Patch(':id')
  updateIngredient(
    @Param('id') id: string,
    @Body() ingredient: UpdateIngredientDto,
  ) {
    return this.ingredientService.updateIngredient(+id, ingredient);
  }

  @Delete(':id')
  deleteIngredient(@Param('id') id: string) {
    return this.ingredientService.deleteIngredient(+id);
  }
}
