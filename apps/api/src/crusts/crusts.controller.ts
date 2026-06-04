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
import { CrustsService } from './crusts.service';
import { CreateCrustDto } from './dto/create-crust.dto';
import { UpdateCrustDto } from './dto/update-crust.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('crusts')
export class CrustsController {
  constructor(private readonly crustsService: CrustsService) {}

  @Get()
  findAllCrusts() {
    return this.crustsService.findAll();
  }

  @Get(':id')
  findCrust(@Param('id') id: string) {
    return this.crustsService.findOne(+id);
  }

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  createCrust(@Body() createCrustDto: CreateCrustDto) {
    return this.crustsService.createCrust(createCrustDto);
  }

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('bulk')
  createManyCrusts(@Body() createCrustDtos: CreateCrustDto[]) {
    return this.crustsService.createManyCrusts(createCrustDtos);
  }

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  updateCrust(@Param('id') id: string, @Body() crustDto: UpdateCrustDto) {
    return this.crustsService.updateCrust(+id, crustDto);
  }

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteCrust(@Param('id') id: string) {
    return this.crustsService.deleteCrust(+id);
  }
}
