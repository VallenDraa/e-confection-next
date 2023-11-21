/*
  Warnings:

  - You are about to drop the column `warna` on the `benang` table. All the data in the column will be lost.
  - Added the required column `color` to the `Benang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `benang` DROP COLUMN `warna`,
    ADD COLUMN `color` VARCHAR(191) NOT NULL;
