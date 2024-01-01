import * as z from 'zod';

export const merekSchema = z.object({ nama: z.string() });

export type MerekSchema = z.infer<typeof merekSchema>;
