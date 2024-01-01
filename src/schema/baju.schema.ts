import { z } from 'zod';

export const newBajuSchema = z.object({
  id: z.string(),
  merekId: z.string().nullable(),
  karyawanId: z.string(),
  sizeId: z.string(),
  seriProduksiId: z.string(),
  warnaId: z.string(),
  rekapGajiKaryawanId: z.string(),
  grupWarnaBajuId: z.string(),
  jumlahDepan: z.number(),
  jumlahBelakang: z.number(),
});

export type NewBaju = z.infer<typeof newBajuSchema>;
