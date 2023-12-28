import { Size } from '@prisma/client';

export function findSize(sizeId: string, sizes: Size[]) {
  return sizes.find(size => size.id === sizeId);
}
