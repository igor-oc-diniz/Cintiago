import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { handlePrismaError } from '../common/prisma-errors.helper';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.product.findMany({
      where: { active: true },
    });
  }

  async createProduct(product: CreateProductDto) {
    try {
      return await this.prisma.product.create({ data: product });
    } catch (error) {
      handlePrismaError(error, 'Product');
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.product.findUniqueOrThrow({ where: { id } });
    } catch (error) {
      handlePrismaError(error, `Product ${id}`);
    }
  }

  async updateProduct(id: number, product: UpdateProductDto) {
    const { name, description, price, active } = product;
    try {
      return await this.prisma.product.update({
        where: { id },
        data: { name, description, price, active },
      });
    } catch (error) {
      handlePrismaError(error, `Product ${id}`);
    }
  }

  async deleteProduct(id: number) {
    try {
      return await this.prisma.product.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error, `Product ${id}`);
    }
  }
}
