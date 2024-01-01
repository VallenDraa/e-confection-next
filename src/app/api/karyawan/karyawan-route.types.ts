import { Karyawan } from '@prisma/client';
import { GETPaginatedResponse } from '../responses.types';

export type KaryawanGETResponse = GETPaginatedResponse<Karyawan[]>;
export type KaryawanPUTBody = {
  id: string;
  nama: string;
  telepon: string;
};
