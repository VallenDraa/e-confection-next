import { z } from 'zod';
export const newGrupWarnaSchema = z.object({
  id: z.string(),
  seriProduksiId: z.string(),
  warnaId: z.string(),
});

export type NewGrupWarna = z.infer<typeof newGrupWarnaSchema>;
