-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('delivery', 'pickup');

-- CreateEnum
CREATE TYPE "PizzaSize" AS ENUM ('small', 'medium', 'large');

-- AlterTable: Order.deliveryType (String -> DeliveryType)
ALTER TABLE "Order" ALTER COLUMN "deliveryType" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "deliveryType" TYPE "DeliveryType" USING ("deliveryType"::"DeliveryType");
ALTER TABLE "Order" ALTER COLUMN "deliveryType" SET DEFAULT 'delivery';

-- AlterTable: OrderItem.size (String -> PizzaSize)
ALTER TABLE "OrderItem" ALTER COLUMN "size" TYPE "PizzaSize" USING ("size"::"PizzaSize");
