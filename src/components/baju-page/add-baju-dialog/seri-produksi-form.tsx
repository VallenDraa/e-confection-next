'use client';

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Link as MuiLink,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { FormProps } from '.';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { overrideNumberInput, willDisableSubmit } from '@/lib/form-helpers';
import { FloatingAlert } from '@/components/ui/floating-alert';
import { useKaryawan } from '@/hooks/server-state-hooks/use-karyawan';
import Link from 'next/link';
import { seriProduksiExists } from '@/actions/seri-produksi';

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
      if (!(await seriProduksiExists(data.nomorSeri))) {
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

  // Call useKaryawan to check if there is a karyawan
  const {
    previewQueryResult: {
      data: previewKaryawanResult,
      error: previewKaryawanError,
      isLoading: isKaryawanLoading,
    },
  } = useKaryawan({
    karyawanPage: 1,
    onError() {
      setAlertMessage(
        previewKaryawanError?.message ?? 'Gagal memuat input No.Seri.',
      );
      setTimeout(() => setAlertMessage(''), 3000);
    },
  });

  return (
    <>
      {isKaryawanLoading || previewKaryawanResult?.data.length === undefined ? (
        <DialogContent>
          <Stack gap={1}>
            <Skeleton variant="rounded" width="100%" height={32} />
            <Skeleton variant="rounded" width="100%" height={32} />
          </Stack>
          <DialogActions sx={{ mt: 2 }}>
            <Skeleton variant="rounded" width={66} height={36} />
            <Skeleton variant="rounded" width={132} height={36} />
          </DialogActions>
        </DialogContent>
      ) : previewKaryawanResult?.data.length > 0 ? (
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
              BATAL
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

          <FloatingAlert
            severity="error"
            isActive={alertMessage !== ''}
            onClose={() => setAlertMessage('')}
          >
            {alertMessage}
          </FloatingAlert>
        </Box>
      ) : (
        <DialogContent>
          <Stack gap={1}>
            <Typography>
              Tidak ada karyawan yang tersedia. Silahkan tambahkan minimal satu!
            </Typography>

            <MuiLink href="/karyawan" component={Link}>
              Halaman Karyawan
            </MuiLink>
          </Stack>
        </DialogContent>
      )}
    </>
  );
}
