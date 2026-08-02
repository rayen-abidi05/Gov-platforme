-- DropForeignKey
ALTER TABLE "ExportRequest" DROP CONSTRAINT "ExportRequest_agrimId_fkey";

-- AlterTable
ALTER TABLE "ExportRequest" ALTER COLUMN "agrimId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ExportRequest" ADD CONSTRAINT "ExportRequest_agrimId_fkey" FOREIGN KEY ("agrimId") REFERENCES "Agrim"("id") ON DELETE SET NULL ON UPDATE CASCADE;
