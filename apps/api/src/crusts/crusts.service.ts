import { Injectable } from '@nestjs/common';
import { CreateCrustDto } from './dto/create-crust.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCrustDto } from './dto/update-crust.dto';
import { handlePrismaError } from '../common/prisma-errors.helper';

@Injectable()
export class CrustsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.crust.findMany({
      where: { active: true },
    });
  }

  async createCrust(crust: CreateCrustDto) {
    try {
      return await this.prisma.crust.create({ data: crust });
    } catch (error) {
      handlePrismaError(error, 'Crust');
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.crust.findUniqueOrThrow({ where: { id } });
    } catch (error) {
      handlePrismaError(error, `Crust ${id}`);
    }
  }

  async updateCrust(id: number, crust: UpdateCrustDto) {
    const { name, description, priceSmall, priceMedium, priceLarge, active } =
      crust;
    try {
      return await this.prisma.crust.update({
        where: { id },
        data: {
          name,
          description,
          priceSmall,
          priceMedium,
          priceLarge,
          active,
        },
      });
    } catch (error) {
      handlePrismaError(error, `Crust ${id}`);
    }
  }

  async deleteCrust(id: number) {
    try {
      return await this.prisma.crust.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error, `Crust ${id}`);
    }
  }
}
