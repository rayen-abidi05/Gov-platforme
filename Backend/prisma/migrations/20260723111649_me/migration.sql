-- CreateEnum
CREATE TYPE "FormulaireStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MINISTER';

-- AlterEnum
ALTER TYPE "documenttype" ADD VALUE 'MARKETCONTROLDECLARATION';

-- CreateTable
CREATE TABLE "MinisterFormulaire" (
    "id" TEXT NOT NULL,
    "status" "FormulaireStatus" NOT NULL DEFAULT 'PENDING',
    "requestText" TEXT NOT NULL,
    "notes" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "registrationRequestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MinisterFormulaire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MinisterFormulaire_registrationRequestId_key" ON "MinisterFormulaire"("registrationRequestId");

-- AddForeignKey
ALTER TABLE "MinisterFormulaire" ADD CONSTRAINT "MinisterFormulaire_registrationRequestId_fkey" FOREIGN KEY ("registrationRequestId") REFERENCES "RegistrationRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
