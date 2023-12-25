import { Merek } from '@prisma/client';
import { OptionalDBMetadata } from './helper';
import * as z from 'zod';

export const merekSchema: z.ZodType<OptionalDBMetadata<Merek>> = z.object({
  id: z.string().cuid().optional(),
  nama: z.string(),
  softDelete: z.date().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
