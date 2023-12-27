import { SeriProduksi } from '@prisma/client';

export type SeriProduksiGETResponse = {
  data: SeriProduksi[];
  metadata: {
    prev: number;
    current: number;
    next: number;
    last: number;
  };
};
