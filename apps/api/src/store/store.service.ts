import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStoreDto } from './dto/update-store.dto';
import { handlePrismaError } from '../common/prisma-errors.helper';

// Campos públicos expostos em GET /store/info.
// Inclui os tempos de preparo/entrega para o frontend derivar o ETA de vitrine.
const publicInfoSelect = {
  id: true,
  name: true,
  description: true,
  phone: true,
  email: true,
  isOpen: true,
  deliveryFee: true,
  minOrderValue: true,
  openingHours: true,
  street: true,
  number: true,
  complement: true,
  neighborhood: true,
  city: true,
  zipCode: true,
  basePrepMinutes: true,
  perPizzaMinutes: true,
  deliveryMinutes: true,
} as const;

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  // Público — dados de vitrine do estabelecimento
  async getInfo() {
    const store = await this.prisma.store.findFirst({
      select: publicInfoSelect,
    });

    if (!store) {
      throw new NotFoundException('Store info not configured');
    }

    return store;
  }

  // OPERATOR — registro completo (inclui tempos de preparo)
  async findFull() {
    const store = await this.prisma.store.findFirst();

    if (!store) {
      throw new NotFoundException('Store info not configured');
    }

    return store;
  }

  // OPERATOR — atualiza o singleton; cria se ainda não existir
  async update(data: UpdateStoreDto) {
    try {
      const existing = await this.prisma.store.findFirst();

      if (!existing) {
        return await this.prisma.store.create({ data });
      }

      return await this.prisma.store.update({
        where: { id: existing.id },
        data,
      });
    } catch (error) {
      handlePrismaError(error, 'Store');
    }
  }
}
