import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { handlePrismaError } from '../common/prisma-errors.helper';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.client.findMany();
  }

  async createClient(client: CreateClientDto) {
    try {
      return await this.prisma.client.create({ data: client });
    } catch (error) {
      handlePrismaError(error, 'Cliente');
    }
  }

  async createMyClient(userId: number, createClientDto: CreateClientDto) {
    createClientDto.userId = userId;
    try {
      return await this.prisma.client.create({ data: createClientDto });
    } catch (error) {
      handlePrismaError(error, 'Cliente');
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.client.findUniqueOrThrow({ where: { id } });
    } catch (error) {
      handlePrismaError(error, `Cliente ${id}`);
    }
  }

  async updateClient(id: number, client: UpdateClientDto) {
    const { phone, street, number, complement, neighborhood, city, zipCode } =
      client;
    try {
      return await this.prisma.client.update({
        where: { id },
        data: {
          phone,
          street,
          number,
          complement,
          neighborhood,
          city,
          zipCode,
        },
      });
    } catch (error) {
      handlePrismaError(error, `Cliente ${id}`);
    }
  }

  async updateMyClient(userId: number, client: UpdateClientDto) {
    const { phone, street, number, complement, neighborhood, city, zipCode } =
      client;
    try {
      return await this.prisma.client.update({
        where: { userId },
        data: {
          phone,
          street,
          number,
          complement,
          neighborhood,
          city,
          zipCode,
        },
      });
    } catch (error) {
      handlePrismaError(error, 'Cliente');
    }
  }

  async deleteClient(id: number) {
    try {
      return await this.prisma.client.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error, `Cliente ${id}`);
    }
  }
}
