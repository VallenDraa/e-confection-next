import { Warna } from '@prisma/client';
import { GETResponse } from '../responses.types';

export type WarnaGETResponse = GETResponse<Warna[]>;

export type WarnaBody = {
  nama: string;
  softDelete: Date | null;
  kodeWarna: string;
};
