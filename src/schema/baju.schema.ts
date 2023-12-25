import {
  Merek as MerekType,
  Baju as BajuType,
  GrupWarnaBaju as GrupWarnaBajuType,
  SeriProduksi as SeriProduksiType,
} from '@prisma/client';
import { z } from 'zod';
import { OptionalDBMetadata } from './helper';

export const merekSchema: z.ZodType<OptionalDBMetadata<MerekType>> = z.object({
  nama: z.string(),
  id: z.string().cuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const bajuSchema: z.ZodType<OptionalDBMetadata<BajuType>> = z.object({
  jumlahDepan: z.number(),
  jumlahBelakang: z.number(),
  sizeId: z.string(),
  grupWarnaBajuId: z.string(),
  merekId: z.string().nullable(),
  id: z.string().cuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const grupWarnaBajuSchema: z.ZodType<
  OptionalDBMetadata<GrupWarnaBajuType>
> = z.object({
  warnaId: z.string(),
  seriProduksiId: z.string(),
  karyawanId: z.string(),
  id: z.string().cuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const seriProduksiSchema: z.ZodType<
  OptionalDBMetadata<SeriProduksiType>
> = z.object({
  nama: z.string().nullable(),
  nomorSeri: z.bigint(),
  id: z.string().cuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
