import { Size } from '@prisma/client';

export function findSizeById(sizeId: string, sizes: Size[]) {
  return sizes.find(size => size.id === sizeId);
}
