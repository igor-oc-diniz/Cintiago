import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.product.findMany({
      where: { active: true },
    });
  }

  async createProduct(product: CreateProductDto) {
    return await this.prisma.product.create({ data: product });
  }

  async findOne(id: number) {
    return await this.prisma.product.findUnique({ where: { id } });
  }

  async updateProduct(id: number, product: UpdateProductDto) {
    const { name, description, price, active } = product;
    return await this.prisma.product.update({
      where: { id },
      data: { name, description, price, active },
    });
  }

  async deleteProduct(id: number) {
    return await this.prisma.product.delete({ where: { id } });
  }
}
