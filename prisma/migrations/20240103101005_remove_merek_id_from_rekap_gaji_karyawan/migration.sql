/*
  Warnings:

  - You are about to drop the column `merekId` on the `rekapgajikaryawan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `rekapgajikaryawan` DROP FOREIGN KEY `RekapGajiKaryawan_merekId_fkey`;

-- AlterTable
ALTER TABLE `rekapgajikaryawan` DROP COLUMN `merekId`;
