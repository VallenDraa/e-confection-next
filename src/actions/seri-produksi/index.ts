'use server';

import { prisma } from '@/lib/prisma';

export async function seriProduksiExists(nomorSeri: number) {
  const seriProduksiExists =
    (await prisma.seriProduksi.count({ where: { nomorSeri } })) > 0;

  return seriProduksiExists;
}
