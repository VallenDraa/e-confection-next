import { Karyawan, RekapGajiKaryawan } from '@prisma/client';
import * as z from 'zod';
import v from 'validator';
import { OptionalDBMetadata } from '@/lib/db';

export const RekapGajiKaryawanSchema: z.ZodType<
  OptionalDBMetadata<RekapGajiKaryawan>
> = z.object({
  jumlahGaji: z.number(),
  karyawanId: z.string(),
  grupWarnaBajuId: z.string(),
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const KaryawanSchema: z.ZodType<OptionalDBMetadata<Karyawan>> = z.object(
  {
    nama: z.string(),
    telepon: z.string().refine(v.isMobilePhone),
    id: z.string().optional(),
    softDelete: z.date().nullable(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  },
);

export const previewKaryawanSchema = z.object({
  id: z.string().optional(),
  nama: z.string(),
  telepon: z.string(),
});

export type PreviewKaryawan = z.infer<typeof previewKaryawanSchema>;
