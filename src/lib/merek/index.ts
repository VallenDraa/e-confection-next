import { Merek } from '@prisma/client';

export function findMerekById(merekId: string, merekList: Merek[]) {
  return merekList.find(seri => seri.id === merekId);
}

export function findMerekByIds(
  merekIds: (string | null)[],
  merekList: Merek[],
) {
  return merekList.filter(seri => merekIds.includes(seri.id));
}
