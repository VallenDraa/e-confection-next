import { z } from 'zod';

export const newBajuSchema = z.object({
  id: z.string(),
  merekId: z.string().nullable(),
  sizeId: z.string(),
  grupWarnaBajuId: z.string(),
  jumlahDepan: z.number(),
  jumlahBelakang: z.number(),
});

export type NewBaju = z.infer<typeof newBajuSchema>;
