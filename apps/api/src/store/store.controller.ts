import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { UpdateStoreDto } from './dto/update-store.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  // Público — usado pelo frontend (Screen 8) para nome, telefone, taxa, etc.
  @Get('info')
  getInfo() {
    return this.storeService.getInfo();
  }

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findFull() {
    return this.storeService.findFull();
  }

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch()
  update(@Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(updateStoreDto);
  }
}
