import { ExistsGETResponse } from '@/app/api/exists/exists.types';
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
    addMerek: { error: addMerekError, mutateAsync },
  } = useMerek({
    onError() {
      setAlertMessage(addMerekError?.message ?? '');
      setTimeout(() => setAlertMessage(''), 3000);
    },
  });

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

      await mutateAsync(formData);
      onClose(false);
      reset();
    } catch (error) {
      if (error instanceof Error) {
        setAlertMessage(error?.message ?? 'Gagal membuat size baru!');
      } else {
        setAlertMessage('Gagal membuat size baru!');
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
