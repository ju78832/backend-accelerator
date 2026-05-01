/*
  Warnings:

  - You are about to drop the column `email` on the `registrations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `registrations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "registrations_email_key";

-- AlterTable
ALTER TABLE "registrations" DROP COLUMN "email";

-- CreateIndex
CREATE UNIQUE INDEX "registrations_phone_key" ON "registrations"("phone");
