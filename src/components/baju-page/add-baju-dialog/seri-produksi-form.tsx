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
import { FloatingAlert } from '@/components/ui/floating-alert';
import axios from 'axios';
import { ExistsGETResponse } from '@/app/api/exists/exists.types';

const seriProduksiFormSchema = z.object({
  nama: z.string().nullable(),
  nomorSeri: z.number(),
});

type SeriProduksiForm = z.infer<typeof seriProduksiFormSchema>;

export default function SeriProduksiForm(props: FormProps<SeriProduksiForm>) {
  const { onSubmit, onCancel } = props;
  const { register, handleSubmit, formState, setValue } =
    useForm<SeriProduksiForm>({
      resolver: zodResolver(seriProduksiFormSchema),
    });

  const [alertMessage, setAlertMessage] = React.useState('');
  async function onSubmitHandler(data: SeriProduksiForm) {
    try {
      // Validate if nomor seri doesn't exists
      const {
        data: { data: isNomorSeriExists },
      } = await axios.get<ExistsGETResponse>(
        `/api/exists/nomor-seri/${data.nomorSeri}`,
      );

      if (!isNomorSeriExists) {
        await onSubmit({ ...data, nama: data.nama ?? null });
      } else {
        setAlertMessage(
          'Nomor seri sudah ada, silahkan gunakan nomor seri lain.',
        );
        setTimeout(() => setAlertMessage(''), 3000);
      }
    } catch (error) {
      if (error instanceof Error) {
        setAlertMessage(error.message);
        setTimeout(() => setAlertMessage(''), 3000);
      }
    }
  }

  return (
    <>
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

      <FloatingAlert
        severity="error"
        isActive={alertMessage !== ''}
        onClose={() => setAlertMessage('')}
      >
        {alertMessage}
      </FloatingAlert>
    </>
  );
}
