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
import { PizzasService } from './pizzas.service';
import { CreatePizzaDto } from './dto/create-pizza.dto';
import { UpdatePizzaDto } from './dto/update-pizza.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('pizzas')
export class PizzasController {
  constructor(private readonly pizzaService: PizzasService) {}

  @Get()
  findAllPizzas() {
    return this.pizzaService.findAll();
  }

  @Get(':id')
  findPizza(@Param('id') id: string) {
    return this.pizzaService.findOne(+id);
  }

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  createPizza(@Body() createPizzaDto: CreatePizzaDto) {
    return this.pizzaService.createPizza(createPizzaDto);
  }

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('bulk')
  createManyPizzas(@Body() createPizzaDtos: CreatePizzaDto[]) {
    return this.pizzaService.createManyPizzas(createPizzaDtos);
  }

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  updatePizza(@Param('id') id: string, @Body() pizzaDto: UpdatePizzaDto) {
    return this.pizzaService.updatePizza(+id, pizzaDto);
  }

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deletePizza(@Param('id') id: string) {
    return this.pizzaService.deletePizza(+id);
  }
}
