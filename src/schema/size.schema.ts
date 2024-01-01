import * as z from 'zod';

export const sizeSchema = z.object({
  nama: z.string(),
  hargaBeforeComma: z.number(),
  hargaAfterComma: z.number(),
});

export type SizeSchema = z.infer<typeof sizeSchema>;
