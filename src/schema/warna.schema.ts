import { Warna } from '@prisma/client';
import { OptionalDBMetadata } from './helper';
import * as z from 'zod';

export const warnaSchema: z.ZodType<OptionalDBMetadata<Warna>> = z.object({
  id: z.string().cuid().optional(),
  nama: z.string(),
  kodeWarna: z.string(),
  softDelete: z.date().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
