'use server';

import { prisma } from '../prisma';

export async function karyawanExists(nama: string) {
  const karyawanExists = (await prisma.karyawan.count({ where: { nama } })) > 0;
  return karyawanExists;
}
