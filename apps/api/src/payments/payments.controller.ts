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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  findAllPayments() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  findPayment(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.createPayment(createPaymentDto);
  }

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  updatePayment(@Param('id') id: string, @Body() paymentDto: UpdatePaymentDto) {
    return this.paymentsService.updatePayment(+id, paymentDto);
  }

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deletePayment(@Param('id') id: string) {
    return this.paymentsService.deletePayment(+id);
  }
}
