/*
  Warnings:

  - The `otpExpiry` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "otpExpiry",
ADD COLUMN     "otpExpiry" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
