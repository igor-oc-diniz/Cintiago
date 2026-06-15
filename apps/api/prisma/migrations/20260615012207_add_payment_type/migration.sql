-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CASH', 'CREDIT', 'DEBIT', 'PIX');

-- AlterTable: troco do pedido (só preenchido quando o pagamento é em dinheiro)
ALTER TABLE "Order" ADD COLUMN     "changeFor" DECIMAL(65,30);

-- AlterTable: adiciona "type" como nullable para permitir o backfill antes do NOT NULL
ALTER TABLE "Payment" ADD COLUMN     "type" "PaymentType";

-- Backfill por match no nome (cobre variações com e sem acento)
UPDATE "Payment" SET "type" = 'CASH'   WHERE lower("name") LIKE '%dinheiro%';
UPDATE "Payment" SET "type" = 'CREDIT' WHERE lower("name") LIKE '%crédito%' OR lower("name") LIKE '%credito%';
UPDATE "Payment" SET "type" = 'DEBIT'  WHERE lower("name") LIKE '%débito%'  OR lower("name") LIKE '%debito%';
UPDATE "Payment" SET "type" = 'PIX'    WHERE lower("name") LIKE '%pix%';

-- Fallback para qualquer linha não casada, garantindo o SET NOT NULL
UPDATE "Payment" SET "type" = 'CREDIT' WHERE "type" IS NULL;

-- Agora a coluna pode se tornar obrigatória
ALTER TABLE "Payment" ALTER COLUMN "type" SET NOT NULL;
