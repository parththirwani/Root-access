/*
  Warnings:

  - You are about to drop the column `displayStyle` on the `Post` table. All the data in the column will be lost.
  - Added the required column `displayStyle` to the `Subsection` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DisplayStyle" AS ENUM ('BLOG', 'PROJECT', 'TITLE_ONLY');

-- DropIndex
DROP INDEX "Post_displayStyle_idx";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "displayStyle";

-- AlterTable
ALTER TABLE "Subsection" ADD COLUMN     "displayStyle" "DisplayStyle" NOT NULL;
