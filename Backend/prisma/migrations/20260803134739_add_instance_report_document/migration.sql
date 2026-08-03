/*
  Warnings:

  - A unique constraint covering the columns `[reportDocumentId]` on the table `Instance` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "documenttype" ADD VALUE 'INSTANCE_REPORT';

-- AlterTable
ALTER TABLE "Instance" ADD COLUMN     "reportDocumentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Instance_reportDocumentId_key" ON "Instance"("reportDocumentId");

-- AddForeignKey
ALTER TABLE "Instance" ADD CONSTRAINT "Instance_reportDocumentId_fkey" FOREIGN KEY ("reportDocumentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
