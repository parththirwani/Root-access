/*
  Warnings:

  - You are about to drop the column `order` on the `Subsection` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `TopCategory` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Subsection_order_idx";

-- DropIndex
DROP INDEX "TopCategory_order_idx";

-- AlterTable
ALTER TABLE "Subsection" DROP COLUMN "order";

-- AlterTable
ALTER TABLE "TopCategory" DROP COLUMN "order";
