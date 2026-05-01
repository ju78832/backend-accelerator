-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('9', '10', '11', '12');

-- CreateEnum
CREATE TYPE "Location" AS ENUM ('Baskhari', 'Tanda', 'Nyori', 'Hyderabad', 'Pune', 'Online');

-- CreateEnum
CREATE TYPE "Subject" AS ENUM ('Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science');

-- CreateTable
CREATE TABLE "registrations" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "grade" "Grade" NOT NULL,
    "location" "Location" NOT NULL,
    "subjects" "Subject"[],
    "address" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "registrations_email_key" ON "registrations"("email");
