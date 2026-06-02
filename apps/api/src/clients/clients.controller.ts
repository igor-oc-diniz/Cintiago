import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  findAllClients() {
    return this.clientsService.findAll();
  }

  @Post()
  createClient(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.createClient(createClientDto);
  }

  @Get(':id')
  findClient(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @Patch(':id')
  updateClient(@Param('id') id: string, @Body() clientDto: UpdateClientDto) {
    return this.clientsService.updateClient(+id, clientDto);
  }

  @Delete(':id')
  deleteClient(@Param('id') id: string) {
    return this.clientsService.deleteClient(+id);
  }
}
