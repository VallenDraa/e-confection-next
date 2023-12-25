import { Size } from '@prisma/client';

export type SizeGETResponse = {
  data: Size[];
};

export type SizeBody = {
  nama: string;
  softDelete: Date | null;
  harga: number;
};
