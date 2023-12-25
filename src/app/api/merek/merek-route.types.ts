import { Merek } from '@prisma/client';

export type MerekGETResponse = {
  data: Merek[];
};

export type MerekBody = {
  nama: string;
  softDelete: Date | null;
};
