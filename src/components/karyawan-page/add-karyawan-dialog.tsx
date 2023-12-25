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
            await onSubmit?.(karyawan);
            reset();
            setOpen(false);
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
              Batal
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
      </Dialog>
    </>
  );
}
