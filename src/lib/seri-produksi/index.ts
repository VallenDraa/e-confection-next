'use server';

import { prisma } from '../prisma';

export async function seriProduksiExists(nomorSeri: number) {
  const seriProduksiExists =
    (await prisma.seriProduksi.count({ where: { nomorSeri } })) > 0;

  return seriProduksiExists;
}

export async function createSeriProduksi(nomorSeri: number, nama?: string) {
  const exists = await seriProduksiExists(nomorSeri);

  if (!exists) {
    throw new Error('Nomor seri produksi yang ingin dibuat sudah digunakan!');
  }

  const newSeriProduksi = await prisma.seriProduksi.create({
    data: { nomorSeri, nama },
  });

  return newSeriProduksi;
}

export async function deleteSeriProduksi(nomorSeri: number) {
  await prisma.seriProduksi.deleteMany({ where: { nomorSeri } });
}
