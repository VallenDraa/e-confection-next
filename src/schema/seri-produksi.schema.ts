import { z } from 'zod';
import { newGrupWarnaSchema } from './grup-warna.schema';
import { newBajuSchema } from './baju.schema';
import { newRekapGajiSchema } from './rekap-gaji.schema';

export const newSeriProduksiSchema = z.object({
  id: z.string(),
  nama: z.string().nullable(),
  nomorSeri: z.number(),
  grupWarnaList: z.array(newGrupWarnaSchema),
  bajuList: z.array(newBajuSchema),
  rekapGajiList: z.array(newRekapGajiSchema),
});

export type NewSeriProduksi = z.infer<typeof newSeriProduksiSchema>;
