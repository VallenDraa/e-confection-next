import z from 'zod';

export const benangSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  color: z.string(),
});

export const benangSchemaWithoutId = benangSchema.omit({ id: true });
