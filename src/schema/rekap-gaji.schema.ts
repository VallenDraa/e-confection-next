import { z } from 'zod';

export const newRekapGajiSchema = z.object({
  id: z.string(),
  karyawanId: z.string(),
  grupWarnaBajuId: z.string(),
  jumlahGaji: z.number(),
});

export type NewRekapGaji = z.infer<typeof newRekapGajiSchema>;
