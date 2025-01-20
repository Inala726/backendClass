-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpires" TEXT,
ADD COLUMN     "verifyEmail" BOOLEAN DEFAULT false;
