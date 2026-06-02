import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

export function handlePrismaError(
  error: unknown,
  resource = 'Registro',
): never {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2025':
        throw new NotFoundException(`${resource} não encontrado`);
      case 'P2002':
        throw new ConflictException(`${resource} já existe com esses dados`);
      case 'P2003':
        throw new BadRequestException(
          `Referência inválida: um recurso relacionado não existe`,
        );
      case 'P2000':
        throw new BadRequestException(`Valor muito longo para o campo`);
    }
  }
  throw error;
}
