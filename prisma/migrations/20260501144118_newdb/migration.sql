/*
  Warnings:

  - The values [Hyderabad,Pune,Online] on the enum `Location` will be removed. If these variants are still used in the database, this will fail.
  - The values [English,Computer Science] on the enum `Subject` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Location_new" AS ENUM ('Baskhari', 'Tanda', 'Nyori');
ALTER TABLE "registrations" ALTER COLUMN "location" TYPE "Location_new" USING ("location"::text::"Location_new");
ALTER TYPE "Location" RENAME TO "Location_old";
ALTER TYPE "Location_new" RENAME TO "Location";
DROP TYPE "Location_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Subject_new" AS ENUM ('Mathematics', 'Physics', 'Chemistry', 'Biology', 'Science');
ALTER TABLE "registrations" ALTER COLUMN "subjects" TYPE "Subject_new"[] USING ("subjects"::text::"Subject_new"[]);
ALTER TYPE "Subject" RENAME TO "Subject_old";
ALTER TYPE "Subject_new" RENAME TO "Subject";
DROP TYPE "Subject_old";
COMMIT;
