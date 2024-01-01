import { RekapGajiKaryawan } from '@prisma/client';
import { GETPaginatedResponse, GETResponse } from '../responses.types';

export type RekapGajiGETPaginatedResponse = GETPaginatedResponse<
  RekapGajiKaryawan[]
>;
export type RekapGajiGETResponse = GETResponse<RekapGajiKaryawan[]>;
