import { z } from 'zod';

export const newRekapGajiSchema = z.object({
  id: z.string(),
  sizeId: z.string(),
  grupWarnaBajuId: z.string(),
  seriProduksiId: z.string(),
  karyawanId: z.string(),
  jumlahGaji: z.number(),
});

export type NewRekapGaji = z.infer<typeof newRekapGajiSchema>;
