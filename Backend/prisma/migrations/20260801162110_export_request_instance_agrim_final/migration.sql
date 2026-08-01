/*
  Warnings:

  - You are about to drop the column `destinationCountry` on the `ExportRequest` table. All the data in the column will be lost.
  - You are about to drop the column `oilType` on the `ExportRequest` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `ExportRequest` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `ExportRequest` table. All the data in the column will be lost.
  - The `status` column on the `ExportRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `agrimId` to the `ExportRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client` to the `ExportRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestedKg` to the `ExportRequest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExportRequestStatus" AS ENUM ('SENT', 'UNDER_COMMITTEE_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "InspectionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "documenttype" ADD VALUE 'AGRIM';
ALTER TYPE "documenttype" ADD VALUE 'CONTRACT';
ALTER TYPE "documenttype" ADD VALUE 'MINISTERIAL_LETTER';

-- AlterTable
ALTER TABLE "ExportRequest" DROP COLUMN "destinationCountry",
DROP COLUMN "oilType",
DROP COLUMN "quantity",
DROP COLUMN "region",
ADD COLUMN     "agrimId" TEXT NOT NULL,
ADD COLUMN     "client" TEXT NOT NULL,
ADD COLUMN     "instanceId" TEXT,
ADD COLUMN     "requestedKg" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "ExportRequestStatus" NOT NULL DEFAULT 'SENT';

-- CreateTable
CREATE TABLE "Agrim" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "limitKg" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agrim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instance" (
    "id" TEXT NOT NULL,
    "meetingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportFileUrl" TEXT,
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Instance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorageInspection" (
    "id" TEXT NOT NULL,
    "registrationRequestId" TEXT NOT NULL,
    "inspectorId" TEXT NOT NULL,
    "status" "InspectionStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "inspectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorageInspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstanceMember" (
    "id" TEXT NOT NULL,
    "instanceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstanceMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agrim_reference_key" ON "Agrim"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "StorageInspection_registrationRequestId_key" ON "StorageInspection"("registrationRequestId");

-- AddForeignKey
ALTER TABLE "ExportRequest" ADD CONSTRAINT "ExportRequest_agrimId_fkey" FOREIGN KEY ("agrimId") REFERENCES "Agrim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExportRequest" ADD CONSTRAINT "ExportRequest_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "Instance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorageInspection" ADD CONSTRAINT "StorageInspection_registrationRequestId_fkey" FOREIGN KEY ("registrationRequestId") REFERENCES "RegistrationRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorageInspection" ADD CONSTRAINT "StorageInspection_inspectorId_fkey" FOREIGN KEY ("inspectorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstanceMember" ADD CONSTRAINT "InstanceMember_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "Instance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstanceMember" ADD CONSTRAINT "InstanceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
