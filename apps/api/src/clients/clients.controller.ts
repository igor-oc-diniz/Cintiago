import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateMyClientDto } from './dto/create-my-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { JwtUser } from '../auth/types/jwt-payload.type';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAllClients() {
    return this.clientsService.findAll();
  }

  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/me')
  createMyClient(
    @Req() req: { user: JwtUser },
    @Body() createClientDto: CreateMyClientDto,
  ) {
    return this.clientsService.createMyClient(req.user.userId, createClientDto);
  }

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  createClient(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.createClient(createClientDto);
  }

  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/me')
  findMyClient(@Req() req: { user: JwtUser }) {
    return this.clientsService.findMyClient(req.user.userId);
  }

  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/me')
  updateMyClient(
    @Req() req: { user: JwtUser },
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.updateMyClient(req.user.userId, updateClientDto);
  }

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findClient(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  updateClient(@Param('id') id: string, @Body() clientDto: UpdateClientDto) {
    return this.clientsService.updateClient(+id, clientDto);
  }

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteClient(@Param('id') id: string) {
    return this.clientsService.deleteClient(+id);
  }
}
