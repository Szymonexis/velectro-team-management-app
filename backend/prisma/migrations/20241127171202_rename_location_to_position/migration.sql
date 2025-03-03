/*
  Warnings:

  - You are about to drop the column `locationId` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_locationId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "locationId";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "locationId";

-- DropTable
DROP TABLE "Location";

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "clientId" TEXT,
    "teamId" TEXT,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Position_clientId_key" ON "Position"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Position_teamId_key" ON "Position"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Position_clientId_teamId_key" ON "Position"("clientId", "teamId");

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
