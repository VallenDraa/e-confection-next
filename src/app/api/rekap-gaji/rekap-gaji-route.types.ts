import { RekapGajiKaryawan } from '@prisma/client';
import { GETPaginatedResponse } from '../responses.types';

export type RekapGajiKaryawanGETData = RekapGajiKaryawan & {
  size: string;
  merek: string | null;
  noSeriProduksi: number;
  warna: string;
};

/**
 * The results are grouped by the seri produksi
 */
export type RekapGajiGETResponse = GETPaginatedResponse<
  RekapGajiKaryawanGETData[]
>;
