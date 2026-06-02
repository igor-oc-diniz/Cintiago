import { Injectable } from '@nestjs/common';
import { CreateCrustDto } from './dto/create-crust.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCrustDto } from './dto/update-crust.dto';

@Injectable()
export class CrustsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.crust.findMany({
      where: { active: true },
    });
  }

  async createCrust(crust: CreateCrustDto) {
    return await this.prisma.crust.create({ data: crust });
  }

  async findOne(id: number) {
    return await this.prisma.crust.findUnique({ where: { id } });
  }

  async updateCrust(id: number, crust: UpdateCrustDto) {
    const { name, description, priceSmall, priceMedium, priceLarge, active } =
      crust;
    return await this.prisma.crust.update({
      where: { id },
      data: { name, description, priceSmall, priceMedium, priceLarge, active },
    });
  }

  async deleteCrust(id: number) {
    return await this.prisma.crust.delete({ where: { id } });
  }
}
