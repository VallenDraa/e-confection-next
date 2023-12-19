import { Karyawan, RekapGajiKaryawan } from '@prisma/client';
import { OmitDBMetadata } from './helper';
import * as z from 'zod';

export const RekapGajiKaryawanSchema: z.ZodType<
  OmitDBMetadata<RekapGajiKaryawan>
> = z.object({
  jumlahGaji: z.bigint(),
  grupWarnaBajuId: z.string().cuid(),
});

export const KaryawanSchema: z.ZodType<OmitDBMetadata<Karyawan>> = z.object({
  nama: z.string(),
  rekapGajiKaryawanId: z.string().cuid().nullable(),
});
