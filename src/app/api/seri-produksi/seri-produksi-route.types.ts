import { SeriProduksi } from '@prisma/client';
import { GETPaginatedResponse, GETResponse } from '../responses.types';

export type IndividualSeriProduksiGETResponse =
  GETResponse<SeriProduksi | null>;

export type SeriProduksiGETResponse = GETPaginatedResponse<SeriProduksi[]>;
