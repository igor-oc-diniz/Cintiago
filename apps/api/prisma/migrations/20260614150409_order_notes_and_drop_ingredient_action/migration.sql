-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "OrderItemHalfIngredient" DROP COLUMN "action";
