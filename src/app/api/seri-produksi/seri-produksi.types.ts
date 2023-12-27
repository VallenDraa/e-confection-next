import { Baju, GrupWarnaBaju, SeriProduksi } from '@prisma/client';

export type SeriProduksiData = SeriProduksi & {
  grupWarnaBaju: Array<GrupWarnaBaju & { baju: Baju[] }>;
};

export type SeriProduksiGETResponse = {
  data: SeriProduksiData[];
  metadata: {
    prev: number;
    current: number;
    next: number;
    last: number;
  };
};
