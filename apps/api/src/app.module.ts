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
import { ClientsModule } from './clients/clients.module';
import { OrdersModule } from './orders/orders.module';
import { IngredientPricesModule } from './ingredient-prices/ingredient-prices.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PizzasModule,
    IngredientsModule,
    ProductsModule,
    PaymentsModule,
    CrustsModule,
    ClientsModule,
    OrdersModule,
    IngredientPricesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
