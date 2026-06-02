import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PizzasModule } from './pizzas/pizzas.module';
import { ConfigModule } from '@nestjs/config';
import { IngredientsModule } from './ingredients/ingredients.module';
import { ProductsModule } from './products/products.module';
import { PaymentsModule } from './payments/payments.module';
import { CrustsModule } from './crusts/crusts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PizzasModule,
    IngredientsModule,
    ProductsModule,
    PaymentsModule,
    CrustsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
