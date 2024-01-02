import { ExistsGETResponse } from '@/app/api/exists/exists.types';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { FloatingAlert } from '@/components/ui/floating-alert';
import { Header } from '@/components/ui/header';
import { useMerek } from '@/hooks/server-state-hooks/use-merek';
import { willDisableSubmit } from '@/lib/form-helpers';
import { MerekSchema, merekSchema } from '@/schema/merek.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import axios from 'axios';
import * as React from 'react';
import { useForm } from 'react-hook-form';

export type MerekInputDialogProps = {
  open: boolean;
  onClose: (open: boolean) => void;
};

export function MerekInputDialog(props: MerekInputDialogProps) {
  const { open, onClose } = props;
  const { register, handleSubmit, formState, reset } = useForm<MerekSchema>({
    resolver: zodResolver(merekSchema),
  });

  const [alertMessage, setAlertMessage] = React.useState('');
  const {
    queryResult: { data: merekResult, error: merekError },
    addMerek: { error: addMerekError, mutateAsync: addMerekMutateAsync },
    deleteMerek: {
      error: deleteMerekError,
      mutateAsync: deleteMerekMutateAsync,
    },
  } = useMerek({
    onError() {
      setAlertMessage(
        merekError?.message ||
          addMerekError?.message ||
          deleteMerekError?.message ||
          '',
      );

      setTimeout(() => setAlertMessage(''), 3000);
    },
  });

  const [toBeDeletedMerek, setToBeDeletedMerek] = React.useState('');

  async function onSubmitHandler(formData: MerekSchema) {
    try {
      const {
        data: { data: exists },
      } = await axios.get<ExistsGETResponse>(
        `/api/exists/merek/${formData.nama}`,
      );

      if (exists) {
        throw new Error('Merek sudah ada!');
      }

      await addMerekMutateAsync(formData);
      reset();
      onClose(false);
    } catch (error) {
      if (error instanceof Error) {
        setAlertMessage(error?.message ?? 'Gagal membuat merek baru!');
      } else {
        setAlertMessage('Gagal membuat merek baru!');
      }

      setTimeout(() => setAlertMessage(''), 3000);
    }
  }

  return (
    <Dialog
      fullWidth
      PaperProps={{ square: false }}
      open={open}
      onClose={onClose}
    >
      <Header>
        <Box display="flex" alignItems="center" px={3}>
          <Typography
            component="h2"
            variant="h6"
            fontWeight={700}
            color={grey[200]}
          >
            Tambah Merek
          </Typography>
        </Box>
      </Header>

      <Box component="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <DialogContent>
          <TextField
            fullWidth
            label="Nama"
            variant="standard"
            size="medium"
            error={!!formState.errors.nama}
            helperText={formState.errors.nama?.message}
            {...register('nama')}
          />

          {merekResult?.data && merekResult?.data.length > 0 && (
            <FormControl sx={{ mt: 3 }} fullWidth>
              <InputLabel id="hapus-merek">Hapus Merek</InputLabel>
              <Select
                variant="standard"
                size="small"
                label="Hapus Merek"
                labelId="hapus-merek"
                value={toBeDeletedMerek}
                onChange={e => setToBeDeletedMerek(e.target.value)}
              >
                {merekResult?.data.map(merek => (
                  <MenuItem value={merek.id} key={merek.id}>
                    {merek.nama}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>

        <DialogActions>
          <Button type="button" color="error" onClick={() => onClose(false)}>
            BATAL
          </Button>

          <Button
            disabled={willDisableSubmit(formState)}
            type="submit"
            variant="contained"
            color="success"
          >
            TAMBAH
          </Button>

          <ConfirmDeleteDialog
            isOpen={toBeDeletedMerek !== ''}
            changeOpen={() => setToBeDeletedMerek('')}
            onDelete={async () => {
              await deleteMerekMutateAsync(toBeDeletedMerek);
              setToBeDeletedMerek('');
            }}
          />
        </DialogActions>

        <FloatingAlert
          severity="error"
          isActive={alertMessage !== ''}
          onClose={() => setAlertMessage('')}
        >
          {alertMessage}
        </FloatingAlert>
      </Box>
    </Dialog>
  );
}
