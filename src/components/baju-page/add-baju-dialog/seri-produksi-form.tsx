'use client';

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
} from '@mui/material';
import * as React from 'react';
import { FormProps } from '.';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { overrideNumberInput, willDisableSubmit } from '@/lib/form-helpers';

const seriProduksiFormSchema = z.object({
  nama: z.string().nullable(),
  nomorSeri: z.number(),
});

type SeriProduksiForm = z.infer<typeof seriProduksiFormSchema>;

export default function SeriProduksiForm(props: FormProps<SeriProduksiForm>) {
  const { onSubmit, onCancel } = props;
  const { register, handleSubmit, formState, setValue, getValues } =
    useForm<SeriProduksiForm>({
      resolver: zodResolver(seriProduksiFormSchema),
    });

  async function onSubmitHandler(data: SeriProduksiForm) {
    await onSubmit({ ...data, nama: data.nama ?? null });
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitHandler)}>
      <DialogContent>
        <Stack gap={1}>
          <TextField
            fullWidth
            label="Nama (Opsional)"
            variant="standard"
            size="medium"
            error={!!formState.errors.nama}
            helperText={formState.errors.nama?.message}
            {...register('nama')}
          />
          <TextField
            fullWidth
            label="No. Seri"
            variant="standard"
            size="medium"
            type="number"
            error={!!formState.errors.nomorSeri}
            helperText={formState.errors.nomorSeri?.message}
            {...register('nomorSeri', {
              onBlur: e => overrideNumberInput(e, 'nomorSeri', setValue),
              onChange: e => overrideNumberInput(e, 'nomorSeri', setValue),
            })}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button type="button" color="error" onClick={onCancel}>
          Batal
        </Button>
        <Button
          disabled={willDisableSubmit(formState)}
          type="submit"
          variant="contained"
          color="success"
        >
          Selanjutnya
        </Button>
      </DialogActions>
    </Box>
  );
}
