/*
  Warnings:

  - You are about to drop the column `endDate` on the `Location` table. All the data in the column will be lost.
  - Made the column `startDate` on table `Location` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Location" DROP COLUMN "endDate",
ADD COLUMN     "duration" TEXT,
ALTER COLUMN "startDate" SET NOT NULL;
