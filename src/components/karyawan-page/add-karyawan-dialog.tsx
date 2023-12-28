'use client';

import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { Header } from '../ui/header';
import { grey } from '@mui/material/colors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Karyawan } from '@prisma/client';
import {
  PreviewKaryawan,
  previewKaryawanSchema,
} from '@/schema/karyawan.schema';
import { willDisableSubmit } from '@/lib/form-helpers';
import axios from 'axios';
import { ExistsGETResponse } from '@/app/api/exists/exists.types';
import { FloatingAlert } from '../ui/floating-alert';
import { karyawanExists } from '@/lib/karyawan';

type AddKaryawanDialogProps = {
  children: (
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) => React.ReactNode;
  onCancel?: () => void;
  onSubmit: (karyawan: Pick<Karyawan, 'nama' | 'telepon'>) => Promise<void>;
};

export function AddKaryawanDialog(props: AddKaryawanDialogProps) {
  const { children, onCancel, onSubmit } = props;
  const [open, setOpen] = React.useState(false);

  const [alertMessage, setAlertMessage] = React.useState('');
  const { register, handleSubmit, formState, reset } = useForm<PreviewKaryawan>(
    { resolver: zodResolver(previewKaryawanSchema) },
  );

  return (
    <>
      {children(setOpen)}

      <Dialog PaperProps={{ square: false }} open={open} onClose={setOpen}>
        <Header>
          <Box display="flex" alignItems="center" px={3}>
            <Typography
              component="h2"
              variant="h6"
              fontWeight={700}
              color={grey[200]}
            >
              Daftar Karyawan
            </Typography>
          </Box>
        </Header>
        <Box
          component="form"
          onSubmit={handleSubmit(async karyawan => {
            try {
              if (!(await karyawanExists(karyawan.nama))) {
                await onSubmit?.(karyawan);
                reset();
                setOpen(false);
              } else {
                setAlertMessage(
                  'Nama karyawan sudah ada, silahkan gunakan nama lain.',
                );
                setTimeout(() => setAlertMessage(''), 3000);
              }
            } catch (error) {
              setAlertMessage('Gagal menambahkan karyawan!.');
              setTimeout(() => setAlertMessage(''), 3000);
            }
          })}
        >
          <DialogContent>
            <Stack direction="row" gap={2}>
              <Avatar sx={{ width: 52, height: 52 }} />

              <Stack gap={1}>
                <TextField
                  fullWidth
                  label="Nama"
                  variant="standard"
                  size="medium"
                  error={!!formState.errors.nama}
                  helperText={formState.errors.nama?.message}
                  {...register('nama')}
                />
                <TextField
                  fullWidth
                  label="Telepon"
                  variant="standard"
                  size="medium"
                  error={!!formState.errors.telepon}
                  helperText={formState.errors.telepon?.message}
                  {...register('telepon')}
                />
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              type="button"
              variant="contained"
              color="error"
              onClick={() => {
                setOpen(false);
                onCancel?.();
              }}
            >
              BATAL
            </Button>
            <Button
              disabled={willDisableSubmit(formState)}
              type="submit"
              variant="contained"
              color="success"
            >
              Tambah
            </Button>
          </DialogActions>
        </Box>

        <FloatingAlert
          isActive={alertMessage !== ''}
          onClose={() => setAlertMessage('')}
          severity="error"
        >
          {alertMessage}
        </FloatingAlert>
      </Dialog>
    </>
  );
}
