import {
  Merek as MerekType,
  Baju as BajuType,
  GrupWarnaBaju as GrupWarnaBajuType,
  SeriProduksi as SeriProduksiType,
} from '@prisma/client';
import { z } from 'zod';
import { OmitDBMetadata } from './helper';

export const MerekSchema: z.ZodType<OmitDBMetadata<MerekType>> = z.object({
  nama: z.string(),
});

export const BajuSchema: z.ZodType<OmitDBMetadata<BajuType>> = z.object({
  jumlahDepan: z.number(),
  jumlahBelakang: z.number(),
  sizeId: z.string(),
  grupWarnaBajuId: z.string(),
  merekId: z.string().nullable(),
});

export const GrupWarnaBajuSchema: z.ZodType<OmitDBMetadata<GrupWarnaBajuType>> =
  z.object({
    warnaId: z.string(),
    seriProduksiId: z.string(),
  });

export const SeriProduksiSchema: z.ZodType<OmitDBMetadata<SeriProduksiType>> =
  z.object({
    nama: z.string().nullable(),
    nomorSeri: z.bigint(),
  });
