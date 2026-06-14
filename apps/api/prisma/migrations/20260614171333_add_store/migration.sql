-- CreateTable
CREATE TABLE "Store" (
    "id" SERIAL NOT NULL,
    "basePrepMinutes" INTEGER NOT NULL DEFAULT 10,
    "perPizzaMinutes" INTEGER NOT NULL DEFAULT 8,
    "deliveryMinutes" INTEGER NOT NULL DEFAULT 20,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- Seed default store config (singleton row)
INSERT INTO "Store" ("basePrepMinutes", "perPizzaMinutes", "deliveryMinutes")
VALUES (10, 8, 20);
