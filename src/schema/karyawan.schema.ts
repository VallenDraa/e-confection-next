import * as z from 'zod';
import v from 'validator';

export const previewKaryawanSchema = z.object({
  id: z.string().optional(),
  nama: z.string(),
  telepon: z.string().refine(v.isMobilePhone),
});

export type PreviewKaryawan = z.infer<typeof previewKaryawanSchema>;
