import { Warna } from '@prisma/client';

export type WarnaGETResponse = {
  data: Warna[];
};

export type WarnaBody = {
  nama: string;
  softDelete: Date | null;
  kodeWarna: string;
};
