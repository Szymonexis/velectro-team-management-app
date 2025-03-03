/*
  Warnings:

  - A unique constraint covering the columns `[createdById]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[editedById]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "editedById" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_createdById_key" ON "User"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "User_editedById_key" ON "User"("editedById");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_editedById_fkey" FOREIGN KEY ("editedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
