import { Karyawan, RekapGajiKaryawan } from '@prisma/client';
import { OptionalDBMetadata } from './helper';
import * as z from 'zod';
import v from 'validator';

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
    telepon: z.string().refine(v.isMobilePhone),
    id: z.string().cuid().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  },
);

export const previewKaryawanSchema = z.object({
  nama: z.string().min(1, 'Nama tidak boleh kosong.'),
  telepon: z.string().refine(v.isMobilePhone, 'No.Telepon tidak valid.'),
});

export type PreviewKaryawanSchema = z.infer<typeof previewKaryawanSchema>;
