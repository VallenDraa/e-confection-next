import { ExistsGETResponse } from '@/app/api/exists/exists.types';
import { ConfirmAddDialog } from '@/components/ui/confirm-add-dialog';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { FloatingAlert } from '@/components/ui/floating-alert';
import { Header } from '@/components/ui/header';
import { NumberInput } from '@/components/ui/number-input';
import { useSize } from '@/hooks/server-state-hooks/use-size';
import { overrideNumberInput, willDisableSubmit } from '@/lib/form-helpers';
import { SizeSchema, sizeSchema } from '@/schema/size.schema';
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
    queryResultBeforeComma: { data: sizeResult, error: sizeError },
    addSize: { error: addSizeError, mutateAsync: addSizeMutateAsync },
    deleteSize: { error: deleteSizeError, mutateAsync: deleteSizeMutateAsync },
  } = useSize({
    onError() {
      setAlertMessage(
        sizeError?.message ||
          addSizeError?.message ||
          deleteSizeError?.message ||
          '',
      );
      setTimeout(() => setAlertMessage(''), 3000);
    },
  });

  const [toBeDeletedSize, setToBeDeletedSize] = React.useState('');

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

      await addSizeMutateAsync(formData);
      reset();
      onClose(false);
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

            <Stack direction="row" gap={2}>
              <NumberInput
                fullWidth
                label="Harga Bulat"
                variant="standard"
                size="medium"
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
                label="Harga Koma"
                variant="standard"
                size="medium"
                error={!!formState.errors.hargaAfterComma}
                {...register('hargaAfterComma', {
                  onBlur: e =>
                    overrideNumberInput(e, 'hargaAfterComma', setValue),
                  onChange: e =>
                    overrideNumberInput(e, 'hargaAfterComma', setValue),
                })}
              />
            </Stack>

            {sizeResult?.data && sizeResult?.data.length > 0 && (
              <FormControl sx={{ mt: 3 }} fullWidth>
                <InputLabel id="hapus-size">Hapus Size</InputLabel>
                <Select
                  variant="standard"
                  size="small"
                  label="Hapus Size"
                  labelId="hapus-size"
                  value={toBeDeletedSize}
                  onChange={e => setToBeDeletedSize(e.target.value)}
                >
                  {sizeResult?.data.map(size => (
                    <MenuItem value={size.id} key={size.id}>
                      {size.nama}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button type="button" color="error" onClick={() => onClose(false)}>
            BATAL
          </Button>

          <Button
            disabled={willDisableSubmit(formState)}
            variant="contained"
            type="submit"
            color="success"
          >
            TAMBAH
          </Button>
        </DialogActions>

        <ConfirmDeleteDialog
          isOpen={toBeDeletedSize !== ''}
          changeOpen={() => setToBeDeletedSize('')}
          onDelete={async () => {
            await deleteSizeMutateAsync(toBeDeletedSize);
            setToBeDeletedSize('');
          }}
        />
      </Box>

      <FloatingAlert
        severity="error"
        isActive={alertMessage !== ''}
        onClose={() => setAlertMessage('')}
      >
        {alertMessage}
      </FloatingAlert>
    </Dialog>
  );
}
