import { Warna } from '@prisma/client';
import { OptionalDBMetadata } from '@/lib/db';
import * as z from 'zod';

export const warnaSchema: z.ZodType<OptionalDBMetadata<Warna>> = z.object({
  id: z.string().optional(),
  nama: z.string(),
  kodeWarna: z.string(),
  softDelete: z.date().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
