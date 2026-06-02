import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.payment.findMany({
      where: { active: true },
    });
  }

  async createPayment(payment: CreatePaymentDto) {
    return await this.prisma.payment.create({ data: payment });
  }

  async findOne(id: number) {
    return await this.prisma.payment.findUnique({ where: { id } });
  }

  async updatePayment(id: number, payment: UpdatePaymentDto) {
    const { name, active } = payment;
    return await this.prisma.payment.update({
      where: { id },
      data: { name, active },
    });
  }

  async deletePayment(id: number) {
    return await this.prisma.payment.delete({ where: { id } });
  }
}
