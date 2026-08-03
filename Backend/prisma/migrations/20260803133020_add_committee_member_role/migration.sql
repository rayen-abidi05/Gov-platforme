/*
  Warnings:

  - You are about to drop the column `createdAt` on the `InstanceMember` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'COMMITTEE_MEMBER';

-- AlterTable
ALTER TABLE "InstanceMember" DROP COLUMN "createdAt";
