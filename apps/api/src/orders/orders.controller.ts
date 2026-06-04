import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { JwtUser } from '../auth/types/jwt-payload.type';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles('OPERATOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Roles('CLIENT')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/my')
  findMyOrders(@Req() req: { user: JwtUser }) {
    return this.ordersService.findMyOrders(req.user.userId);
  }

  @Roles('OPERATOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Roles('OPERATOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(+id, status);
  }

  @Roles('CLIENT')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Req() req: { user: JwtUser }, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user.userId, dto);
  }
}
