import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.client.findMany();
  }

  async createClient(client: CreateClientDto) {
    return await this.prisma.client.create({ data: client });
  }

  async findOne(id: number) {
    return await this.prisma.client.findUnique({ where: { id } });
  }

  async updateClient(id: number, client: UpdateClientDto) {
    const {
      name,
      phone,
      street,
      number,
      complement,
      neighborhood,
      city,
      zipCode,
    } = client;
    return await this.prisma.client.update({
      where: { id },
      data: {
        name,
        phone,
        street,
        number,
        complement,
        neighborhood,
        city,
        zipCode,
      },
    });
  }

  async deleteClient(id: number) {
    return await this.prisma.client.delete({ where: { id } });
  }
}
