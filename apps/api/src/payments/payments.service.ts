import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { handlePrismaError } from '../common/prisma-errors.helper';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.payment.findMany({
      where: { active: true },
    });
  }

  async createPayment(payment: CreatePaymentDto) {
    try {
      return await this.prisma.payment.create({ data: payment });
    } catch (error) {
      handlePrismaError(error, 'Payment');
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.payment.findUniqueOrThrow({ where: { id } });
    } catch (error) {
      handlePrismaError(error, `Payment ${id}`);
    }
  }

  async updatePayment(id: number, payment: UpdatePaymentDto) {
    const { name, active } = payment;
    try {
      return await this.prisma.payment.update({
        where: { id },
        data: { name, active },
      });
    } catch (error) {
      handlePrismaError(error, `Payment ${id}`);
    }
  }

  async deletePayment(id: number) {
    try {
      return await this.prisma.payment.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error, `Payment ${id}`);
    }
  }
}
