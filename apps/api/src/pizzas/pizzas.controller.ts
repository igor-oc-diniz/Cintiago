import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { PizzasService } from './pizzas.service';
import { CreatePizzaDto } from './dto/create-pizza.dto';
import { UpdatePizzaDto } from './dto/update-pizza.dto';

@Controller('pizzas')
export class PizzasController {
  constructor(private readonly pizzaService: PizzasService) {}

  @Get()
  findAllPizzas() {
    return this.pizzaService.findAll();
  }

  @Post()
  createPizza(@Body() createPizzaDto: CreatePizzaDto) {
    return this.pizzaService.createPizza(createPizzaDto);
  }

  @Get(':id')
  findPizza(@Param('id') id: string) {
    return this.pizzaService.findOne(+id);
  }

  @Patch(':id')
  updatePizza(@Param('id') id: string, @Body() pizzaDto: UpdatePizzaDto) {
    return this.pizzaService.updatePizza(+id, pizzaDto);
  }

  @Delete(':id')
  deletePizza(@Param('id') id: string) {
    return this.pizzaService.deletePizza(+id);
  }
}
