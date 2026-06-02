import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CrustsService } from './crusts.service';
import { CreateCrustDto } from './dto/create-crust.dto';
import { UpdateCrustDto } from './dto/update-crust.dto';

@Controller('crusts')
export class CrustsController {
  constructor(private readonly crustsService: CrustsService) {}

  @Get()
  findAllCrusts() {
    return this.crustsService.findAll();
  }

  @Post()
  createCrust(@Body() createCrustDto: CreateCrustDto) {
    return this.crustsService.createCrust(createCrustDto);
  }

  @Get(':id')
  findCrust(@Param('id') id: string) {
    return this.crustsService.findOne(+id);
  }

  @Patch(':id')
  updateCrust(@Param('id') id: string, @Body() crustDto: UpdateCrustDto) {
    return this.crustsService.updateCrust(+id, crustDto);
  }

  @Delete(':id')
  deleteCrust(@Param('id') id: string) {
    return this.crustsService.deleteCrust(+id);
  }
}
