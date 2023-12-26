import { Baju } from '@prisma/client';

export type BajuGETResponse = {
  data: Baju[];
  metadata: {
    prev: number;
    current: number;
    next: number;
    last: number;
  };
};
