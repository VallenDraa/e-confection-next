import { ExistsGETResponse } from '@/app/api/exists/exists.types';
import { FloatingAlert } from '@/components/ui/floating-alert';
import { Header } from '@/components/ui/header';
import { NumberInput } from '@/components/ui/number-input';
import useSize from '@/hooks/server-state-hooks/use-size';
import { overrideNumberInput, willDisableSubmit } from '@/lib/form-helpers';
import { SizeSchema, sizeSchema } from '@/schema/size.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import axios from 'axios';
import * as React from 'react';
import { useForm } from 'react-hook-form';

export type SizeInputDialogProps = {
  open: boolean;
  onClose: (open: boolean) => void;
};

export function SizeInputDialog(props: SizeInputDialogProps) {
  const { open, onClose } = props;
  const { register, handleSubmit, formState, reset, setValue } =
    useForm<SizeSchema>({ resolver: zodResolver(sizeSchema) });

  const [alertMessage, setAlertMessage] = React.useState('');
  const {
    addSize: { error: addSizeError, mutateAsync },
  } = useSize({
    onError() {
      setAlertMessage(addSizeError?.message ?? '');
      setTimeout(() => setAlertMessage(''), 3000);
    },
  });

  async function onSubmitHandler(formData: SizeSchema) {
    try {
      const {
        data: { data: exists },
      } = await axios.get<ExistsGETResponse>(
        `/api/exists/size/${formData.nama}`,
      );

      if (exists) {
        throw new Error('Size sudah ada!');
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
            Tambah Size
          </Typography>
        </Box>
      </Header>

      <Box component="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <DialogContent>
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

            <NumberInput
              fullWidth
              label="Harga Sebelum Comma"
              variant="standard"
              size="medium"
              type="number"
              error={!!formState.errors.hargaBeforeComma}
              {...register('hargaBeforeComma', {
                onBlur: e =>
                  overrideNumberInput(e, 'hargaBeforeComma', setValue),
                onChange: e =>
                  overrideNumberInput(e, 'hargaBeforeComma', setValue),
              })}
            />

            <NumberInput
              fullWidth
              label="Harga Setelah Comma"
              variant="standard"
              size="medium"
              type="number"
              error={!!formState.errors.hargaAfterComma}
              {...register('hargaAfterComma', {
                onBlur: e =>
                  overrideNumberInput(e, 'hargaAfterComma', setValue),
                onChange: e =>
                  overrideNumberInput(e, 'hargaAfterComma', setValue),
              })}
            />
          </Stack>
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
