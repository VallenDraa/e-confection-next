import {
  Merek as MerekType,
  Baju as BajuType,
  GrupWarnaBaju as GrupWarnaBajuType,
  SeriProduksi as SeriProduksiType,
} from '@prisma/client';
import { z } from 'zod';
import { OptionalDBMetadata } from './helper';

export const MerekSchema: z.ZodType<OptionalDBMetadata<MerekType>> = z.object({
  nama: z.string(),
  id: z.string().cuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const BajuSchema: z.ZodType<OptionalDBMetadata<BajuType>> = z.object({
  jumlahDepan: z.number(),
  jumlahBelakang: z.number(),
  sizeId: z.string(),
  grupWarnaBajuId: z.string(),
  merekId: z.string().nullable(),
  id: z.string().cuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const GrupWarnaBajuSchema: z.ZodType<
  OptionalDBMetadata<GrupWarnaBajuType>
> = z.object({
  warnaId: z.string(),
  seriProduksiId: z.string(),
  karyawanName: z.string(),
  id: z.string().cuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const SeriProduksiSchema: z.ZodType<
  OptionalDBMetadata<SeriProduksiType>
> = z.object({
  nama: z.string().nullable(),
  nomorSeri: z.bigint(),
  id: z.string().cuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
