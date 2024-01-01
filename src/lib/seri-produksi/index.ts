import { SeriProduksi } from '@prisma/client';

export function findSeriProduksiById(
  seriProduksiId: string,
  seriProduksiList: SeriProduksi[],
) {
  return seriProduksiList.find(seri => seri.id === seriProduksiId);
}

export function findSeriProduksiByNomorSeri(
  nomorSeri: number,
  seriProduksiList: SeriProduksi[],
) {
  return seriProduksiList.find(seri => seri.nomorSeri === nomorSeri);
}
