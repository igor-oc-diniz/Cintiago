import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Roles('OPERATOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAllClients() {
    return this.clientsService.findAll();
  }

  @Roles('OPERATOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  createClient(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.createClient(createClientDto);
  }

  @Roles('OPERATOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findClient(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @Roles('OPERATOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  updateClient(@Param('id') id: string, @Body() clientDto: UpdateClientDto) {
    return this.clientsService.updateClient(+id, clientDto);
  }

  @Roles('OPERATOR')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteClient(@Param('id') id: string) {
    return this.clientsService.deleteClient(+id);
  }
}
