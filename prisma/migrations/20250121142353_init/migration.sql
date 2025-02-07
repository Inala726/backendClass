/*
  Warnings:

  - You are about to drop the column `otpExpires` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verifyEmail` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "otpExpires",
DROP COLUMN "verifyEmail",
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otpExpiry" TEXT;
