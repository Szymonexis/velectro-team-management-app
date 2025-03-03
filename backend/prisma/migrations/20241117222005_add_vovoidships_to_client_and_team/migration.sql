/*
  Warnings:

  - Added the required column `vovoidship` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vovoidship` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "vovoidship" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "vovoidship" TEXT NOT NULL;
