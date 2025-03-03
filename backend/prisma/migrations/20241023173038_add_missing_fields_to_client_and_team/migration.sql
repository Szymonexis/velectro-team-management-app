-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "invoiceIsDone" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "description" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "description" TEXT;
