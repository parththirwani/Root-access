/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Subsection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subsection_name_key" ON "Subsection"("name");
