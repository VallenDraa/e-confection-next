import { Warna } from '@prisma/client';

export type WarnaGETResponse = {
  data: Warna[];
};

export type WarnaBody = {
  nama: string;
  kodeWarna: string;
};
