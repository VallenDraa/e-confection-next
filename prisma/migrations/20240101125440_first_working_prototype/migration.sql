/*
  Warnings:

  - You are about to drop the `barang` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `benang` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rekapbarangkaryawan` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nama]` on the table `Karyawan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `telepon` to the `Karyawan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Karyawan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `rekapbarangkaryawan` DROP FOREIGN KEY `RekapBarangKaryawan_barangId_fkey`;

-- DropForeignKey
ALTER TABLE `rekapbarangkaryawan` DROP FOREIGN KEY `RekapBarangKaryawan_karyawanId_fkey`;

-- AlterTable
ALTER TABLE `karyawan` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `softDelete` DATETIME(3) NULL,
    ADD COLUMN `telepon` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `barang`;

-- DropTable
DROP TABLE `benang`;

-- DropTable
DROP TABLE `rekapbarangkaryawan`;

-- CreateTable
CREATE TABLE `Size` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `afterCommaPairId` VARCHAR(191) NULL,
    `harga` INTEGER NOT NULL,
    `softDelete` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Size_nama_key`(`nama`),
    UNIQUE INDEX `Size_afterCommaPairId_key`(`afterCommaPairId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Warna` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `kodeWarna` VARCHAR(191) NOT NULL,
    `softDelete` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Warna_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Merek` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `softDelete` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Merek_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Baju` (
    `id` VARCHAR(191) NOT NULL,
    `jumlahDepan` INTEGER NOT NULL,
    `jumlahBelakang` INTEGER NOT NULL,
    `seriProduksiId` VARCHAR(191) NOT NULL,
    `rekapGajiKaryawanId` VARCHAR(191) NOT NULL,
    `karyawanId` VARCHAR(191) NOT NULL,
    `sizeId` VARCHAR(191) NOT NULL,
    `warnaId` VARCHAR(191) NOT NULL,
    `grupWarnaBajuId` VARCHAR(191) NOT NULL,
    `merekId` VARCHAR(191) NULL,
    `softDelete` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GrupWarnaBaju` (
    `id` VARCHAR(191) NOT NULL,
    `warnaId` VARCHAR(191) NOT NULL,
    `seriProduksiId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SeriProduksi` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NULL,
    `nomorSeri` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SeriProduksi_nomorSeri_key`(`nomorSeri`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RekapGajiKaryawan` (
    `id` VARCHAR(191) NOT NULL,
    `sizeId` VARCHAR(191) NOT NULL,
    `jumlahGaji` INTEGER NOT NULL,
    `grupWarnaBajuId` VARCHAR(191) NOT NULL,
    `karyawanId` VARCHAR(191) NOT NULL,
    `merekId` VARCHAR(191) NULL,
    `seriProduksiId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Karyawan_nama_key` ON `Karyawan`(`nama`);

-- AddForeignKey
ALTER TABLE `Size` ADD CONSTRAINT `Size_afterCommaPairId_fkey` FOREIGN KEY (`afterCommaPairId`) REFERENCES `Size`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Baju` ADD CONSTRAINT `Baju_seriProduksiId_fkey` FOREIGN KEY (`seriProduksiId`) REFERENCES `SeriProduksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Baju` ADD CONSTRAINT `Baju_rekapGajiKaryawanId_fkey` FOREIGN KEY (`rekapGajiKaryawanId`) REFERENCES `RekapGajiKaryawan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Baju` ADD CONSTRAINT `Baju_karyawanId_fkey` FOREIGN KEY (`karyawanId`) REFERENCES `Karyawan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Baju` ADD CONSTRAINT `Baju_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `Size`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Baju` ADD CONSTRAINT `Baju_warnaId_fkey` FOREIGN KEY (`warnaId`) REFERENCES `Warna`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Baju` ADD CONSTRAINT `Baju_grupWarnaBajuId_fkey` FOREIGN KEY (`grupWarnaBajuId`) REFERENCES `GrupWarnaBaju`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Baju` ADD CONSTRAINT `Baju_merekId_fkey` FOREIGN KEY (`merekId`) REFERENCES `Merek`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GrupWarnaBaju` ADD CONSTRAINT `GrupWarnaBaju_warnaId_fkey` FOREIGN KEY (`warnaId`) REFERENCES `Warna`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GrupWarnaBaju` ADD CONSTRAINT `GrupWarnaBaju_seriProduksiId_fkey` FOREIGN KEY (`seriProduksiId`) REFERENCES `SeriProduksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RekapGajiKaryawan` ADD CONSTRAINT `RekapGajiKaryawan_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `Size`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RekapGajiKaryawan` ADD CONSTRAINT `RekapGajiKaryawan_grupWarnaBajuId_fkey` FOREIGN KEY (`grupWarnaBajuId`) REFERENCES `GrupWarnaBaju`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RekapGajiKaryawan` ADD CONSTRAINT `RekapGajiKaryawan_karyawanId_fkey` FOREIGN KEY (`karyawanId`) REFERENCES `Karyawan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RekapGajiKaryawan` ADD CONSTRAINT `RekapGajiKaryawan_merekId_fkey` FOREIGN KEY (`merekId`) REFERENCES `Merek`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RekapGajiKaryawan` ADD CONSTRAINT `RekapGajiKaryawan_seriProduksiId_fkey` FOREIGN KEY (`seriProduksiId`) REFERENCES `SeriProduksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
