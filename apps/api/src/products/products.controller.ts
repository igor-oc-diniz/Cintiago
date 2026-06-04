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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAllProducts() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findProduct(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('bulk')
  createManyProducts(@Body() createProductDtos: CreateProductDto[]) {
    return this.productsService.createManyProducts(createProductDtos);
  }

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  updateProduct(@Param('id') id: string, @Body() productDto: UpdateProductDto) {
    return this.productsService.updateProduct(+id, productDto);
  }

  @Roles(Role.OPERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(+id);
  }
}
