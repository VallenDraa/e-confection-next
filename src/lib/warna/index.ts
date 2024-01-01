import { Warna } from '@prisma/client';

export function findWarnaById(warnaId: string, warnaList: Warna[]) {
  return warnaList.find(warna => warna.id === warnaId);
}
