import { Size } from '@prisma/client';
import { OptionalDBMetadata } from '@/lib/db';
import * as z from 'zod';

export const sizeSchema: z.ZodType<OptionalDBMetadata<Size>> = z.object({
  id: z.string().optional(),
  nama: z.string(),
  harga: z.number(),
  softDelete: z.date().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
