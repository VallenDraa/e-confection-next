import { z } from 'zod';
import { newGrupWarnaSchema } from './grup-warna.schema';
import { newBajuSchema } from './baju.schema';

export const newSeriProduksiSchema = z.object({
  id: z.string(),
  nama: z.string().nullable(),
  nomorSeri: z.number(),
  grupWarnaList: z.array(newGrupWarnaSchema),
  bajuList: z.array(newBajuSchema),
});

export type NewSeriProduksi = z.infer<typeof newSeriProduksiSchema>;
