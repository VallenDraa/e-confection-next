import { Merek } from '@prisma/client';

export function findMerekById(merekId: string, merekList: Merek[]) {
  return merekList.find(seri => seri.id === merekId);
}
