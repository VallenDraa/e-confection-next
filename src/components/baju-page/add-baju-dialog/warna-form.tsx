'use client';

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { FormProps } from '.';
import DeleteIcon from '@mui/icons-material/Delete';
import { useWarna } from '@/hooks/server-state-hooks/use-warna';
import { FloatingAlert } from '@/components/ui/floating-alert';
import { grey } from '@mui/material/colors';
import { WarnaBody } from '@/app/api/warna/warna-route.types';
import { NamedCheckbox } from './named-checkbox';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { ColorCircle } from '@/components/ui/color-circle';
import { useBajuFormStore } from '@/store/baju-form-store';

type WarnaForm = {
  warnaIds: string[];
};

const DEFAULT_NEW_COLOR = { nama: '', kodeWarna: '#000000', softDelete: null };

export default function WarnaForm(props: FormProps<WarnaForm>) {
  const { onSubmit, onCancel } = props;

  const { selectedWarna } = useBajuFormStore(state => state.formData);
  const [warnaIds, setWarnaIds] = React.useState<string[]>(selectedWarna);
  const [isAlertOn, setIsAlertOn] = React.useState(false);

  const {
    queryResult: { data: result, error, isLoading },
    addWarna,
    deleteWarna,
  } = useWarna({
    onError() {
      setIsAlertOn(true);
      setTimeout(() => setIsAlertOn(false), 3000);
    },
  });

  // New color handler
  const [newColor, setNewColor] = React.useState<WarnaBody>(DEFAULT_NEW_COLOR);
  function handleWarnaCheckbox(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    colorId: string,
  ) {
    setWarnaIds(prev => {
      return Array.from(
        new Set(
          (e.target as HTMLInputElement).checked
            ? [...prev, colorId]
            : prev.filter(id => id !== colorId),
        ),
      );
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await onSubmit({ warnaIds });
  }

  return (
    <>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack gap={1}>
            {isLoading && (
              <>
                <Skeleton variant="rounded" width="100%" height={41} />
                <Skeleton variant="rounded" width="100%" height={41} />
              </>
            )}

            {!isLoading && (!result || result?.data.length === 0) ? (
              <Typography
                textAlign="center"
                my={2}
                variant="subtitle1"
                color={grey[600]}
                fontWeight={500}
                component="p"
              >
                {error
                  ? 'Error mengambil warna, silahkan coba diwaktu lain.'
                  : 'Belum ada warna, silahkan tambah warna baru.'}
              </Typography>
            ) : (
              result?.data.map(color => {
                return (
                  <ConfirmDeleteDialog
                    key={color.id}
                    onDelete={async () =>
                      await deleteWarna.mutateAsync(color.id)
                    }
                  >
                    {setOpen => (
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={2}
                      >
                        <NamedCheckbox
                          labelFullWidth
                          label={color.nama}
                          onChange={e => handleWarnaCheckbox(e, color.id)}
                          value={warnaIds.includes(color.id)}
                        />

                        {/* Color code and delete button */}
                        <Box display="flex" alignItems="center" gap={1}>
                          <ColorCircle bgColor={color.kodeWarna} />
                          <IconButton
                            color="error"
                            size="medium"
                            onClick={() => setOpen(true)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    )}
                  </ConfirmDeleteDialog>
                );
              })
            )}

            <Box
              display="flex"
              gap={1.5}
              justifyContent="space-between"
              alignItems="end"
            >
              <Box flexGrow={1} display="flex" alignItems="end" gap={1}>
                <TextField
                  fullWidth
                  label="Nama Warna Baru"
                  variant="standard"
                  value={newColor.nama}
                  onChange={e =>
                    setNewColor(prev => ({ ...prev, nama: e.target.value }))
                  }
                />
                <input
                  type="color"
                  value={newColor.kodeWarna}
                  onChange={e =>
                    setNewColor(prev => ({
                      ...prev,
                      kodeWarna: e.target.value,
                    }))
                  }
                />
              </Box>

              <Button
                type="button"
                size="small"
                variant="contained"
                color="success"
                disabled={
                  newColor.nama.trim() === '' || newColor.kodeWarna === ''
                }
                onClick={async () => {
                  await addWarna.mutateAsync(newColor);
                  setNewColor(DEFAULT_NEW_COLOR);
                }}
              >
                Tambah
              </Button>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            color="error"
            onClick={() => onCancel?.({ warnaIds })}
          >
            BATAL
          </Button>
          <Button
            disabled={warnaIds.length === 0}
            type="submit"
            variant="contained"
            color="success"
          >
            Selanjutnya
          </Button>
        </DialogActions>
      </Box>

      {/* Alert message */}
      <FloatingAlert
        severity="error"
        isActive={isAlertOn}
        onClose={() => setIsAlertOn(false)}
      >
        {error?.message}
      </FloatingAlert>
    </>
  );
}
