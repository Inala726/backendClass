-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleID" TEXT,
ADD COLUMN     "provider" TEXT DEFAULT 'local';
