/*
  Warnings:

  - You are about to drop the column `vovoidship` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `vovoidship` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "vovoidship",
ADD COLUMN     "voivodeship" TEXT;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "vovoidship",
ADD COLUMN     "voivodeship" TEXT;
