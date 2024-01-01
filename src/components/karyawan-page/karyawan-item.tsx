import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Karyawan } from '@prisma/client';
import * as React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import grey from '@mui/material/colors/grey';
import { Header } from '../ui/header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PreviewKaryawan,
  previewKaryawanSchema,
} from '@/schema/karyawan.schema';
import { willDisableSubmit } from '@/lib/form-helpers';
import { KaryawanPUTBody } from '@/app/api/karyawan/karyawan-route.types';
import WorkHistoryList from './rekap-gaji-list';
import { karyawanExists } from '@/lib/karyawan';
import { FloatingAlert } from '../ui/floating-alert';

type KaryawanItemProps = {
  karyawan: Karyawan;
  checkable: boolean;
  onChecked: (isChecked: boolean) => void;
  onEdit: (karyawan: KaryawanPUTBody) => void;
};

export function KaryawanItem(props: KaryawanItemProps) {
  const { karyawan, checkable, onChecked, onEdit } = props;

  const { register, handleSubmit, formState, reset, getValues } =
    useForm<PreviewKaryawan>({
      resolver: zodResolver(previewKaryawanSchema),
      defaultValues: { nama: karyawan.nama, telepon: karyawan.telepon },
    });

  const [alertMessage, setAlertMessage] = React.useState('');
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  async function handleEditKaryawan(editedKaryawan: PreviewKaryawan) {
    try {
      if (!(await karyawanExists(editedKaryawan.nama))) {
        await onEdit?.({
          id: karyawan.id,
          nama: editedKaryawan.nama,
          telepon: editedKaryawan.telepon,
        });

        setIsEditing(false);
      } else {
        setAlertMessage('Nama karyawan sudah ada, silahkan gunakan nama lain.');
        setTimeout(() => setAlertMessage(''), 3000);
      }
    } catch (error) {
      setAlertMessage('Gagal mengedit karyawan!');
      setTimeout(() => setAlertMessage(''), 3000);
    }
  }

  return (
    <>
      {/* Karyawan item horizontal card */}
      <Paper
        component="button"
        elevation={2}
        sx={{
          border: 'none',
          padding: '12px',
          backgroundColor: grey[200],
          cursor: 'pointer',
          transition: '200ms ease-in background-color',
          '&:hover': {
            backgroundColor: grey[300],
          },
        }}
        onClick={() => {
          if (!checkable) {
            setIsDetailOpen(true);
          }
        }}
      >
        <Stack direction="row" gap={3} alignItems="center">
          <Avatar alt="Avatar" variant="circular">
            <PersonIcon />
          </Avatar>

          <Stack direction="row" justifyContent="space-between" flexGrow={1}>
            <Stack>
              <Typography
                textAlign="start"
                noWrap
                variant="h6"
                fontWeight="600"
                component="h2"
              >
                {karyawan.nama}
              </Typography>
              <Typography
                noWrap
                textAlign="start"
                variant="body2"
                component="a"
                color={grey[600]}
                href={`tel:${karyawan.telepon}`}
              >
                {karyawan.telepon}
              </Typography>
            </Stack>

            {checkable && (
              <Checkbox onChange={e => onChecked(e.target.checked)} />
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Karyawan detail dialog */}
      <Dialog fullWidth open={isDetailOpen} onClose={setIsDetailOpen}>
        <Header>
          <Box display="flex" alignItems="center" width="100%" pl={1} pr={3}>
            <IconButton color="info" onClick={() => setIsDetailOpen(false)}>
              <ArrowBackIcon sx={{ fill: 'white' }} />
            </IconButton>

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
        <Box component="form" onSubmit={handleSubmit(handleEditKaryawan)}>
          <DialogContent>
            <Paper sx={{ padding: '24px', backgroundColor: grey[100] }}>
              <Stack direction="row" alignItems="center" gap={2}>
                <Avatar
                  variant="rounded"
                  sx={{ aspectRatio: '1/1', height: '100%', width: '77px' }}
                />

                <Stack gap={1} flexGrow={1}>
                  <TextField
                    fullWidth
                    label="Nama"
                    variant="standard"
                    size="medium"
                    disabled={!isEditing}
                    error={!!formState.errors.nama}
                    helperText={formState.errors.nama?.message}
                    {...register('nama')}
                    sx={{
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: grey[900],
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Telepon"
                    variant="standard"
                    size="medium"
                    disabled={!isEditing}
                    error={!!formState.errors.telepon}
                    helperText={formState.errors.telepon?.message}
                    {...register('telepon')}
                    sx={{
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: grey[900],
                      },
                    }}
                  />
                </Stack>
              </Stack>
            </Paper>

            {isEditing ? (
              <Stack mt={2} gap={1}>
                <Button
                  disabled={
                    willDisableSubmit(formState) ||
                    (getValues('nama') === karyawan.nama &&
                      getValues('telepon') === karyawan.telepon)
                  }
                  type="submit"
                  color="success"
                  variant="contained"
                >
                  SIMPAN
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    reset();
                  }}
                  color="error"
                  variant="contained"
                >
                  CANCEL
                </Button>
              </Stack>
            ) : (
              <Button
                type="button"
                fullWidth
                sx={{ marginTop: '16px' }}
                onClick={() => setIsEditing(true)}
                color="success"
                variant="contained"
              >
                Edit
              </Button>
            )}

            <Typography
              fontWeight={700}
              variant="h6"
              mt={3}
              mb={1}
              component="h2"
            >
              Riwayat Pekerjaan
            </Typography>
            <WorkHistoryList karyawanId={karyawan.id} />
          </DialogContent>
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
