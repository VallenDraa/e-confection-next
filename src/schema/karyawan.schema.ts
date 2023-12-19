import { Karyawan, RekapGajiKaryawan } from '@prisma/client';
import { OptionalDBMetadata } from './helper';
import * as z from 'zod';

export const RekapGajiKaryawanSchema: z.ZodType<
  OptionalDBMetadata<RekapGajiKaryawan>
> = z.object({
  jumlahGaji: z.bigint(),
  karyawanId: z.string().cuid(),
  grupWarnaBajuId: z.string().cuid(),
  id: z.string().cuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const KaryawanSchema: z.ZodType<OptionalDBMetadata<Karyawan>> = z.object(
  {
    nama: z.string(),
    rekapGajiKaryawanId: z.string().cuid().nullable(),
    id: z.string().cuid().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  },
);
