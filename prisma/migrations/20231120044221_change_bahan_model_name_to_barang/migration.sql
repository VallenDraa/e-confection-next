/*
  Warnings:

  - You are about to drop the column `bahanId` on the `rekapbarangkaryawan` table. All the data in the column will be lost.
  - You are about to drop the `bahan` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `barangId` to the `RekapBarangKaryawan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `rekapbarangkaryawan` DROP FOREIGN KEY `RekapBarangKaryawan_bahanId_fkey`;

-- AlterTable
ALTER TABLE `rekapbarangkaryawan` DROP COLUMN `bahanId`,
    ADD COLUMN `barangId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `bahan`;

-- CreateTable
CREATE TABLE `Barang` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `harga` DECIMAL(65, 30) NOT NULL,
    `size` DECIMAL(65, 30) NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RekapBarangKaryawan` ADD CONSTRAINT `RekapBarangKaryawan_barangId_fkey` FOREIGN KEY (`barangId`) REFERENCES `Barang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
