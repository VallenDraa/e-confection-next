import { Merek } from '@prisma/client';
import { GETResponse } from '../responses.types';

export type MerekGETResponse = GETResponse<Merek[]>;

export type MerekBody = {
  nama: string;
};
