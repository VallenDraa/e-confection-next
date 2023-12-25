'use client';

import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Stack,
} from '@mui/material';
import * as React from 'react';
import { FormProps } from '.';

type WarnaForm = {
  warnaIds: string[];
};

const colors = [
  { id: crypto.randomUUID(), nama: 'Red' },
  { id: crypto.randomUUID(), nama: 'Blue' },
  { id: crypto.randomUUID(), nama: 'Green' },
  { id: crypto.randomUUID(), nama: 'Yellow' },
  { id: crypto.randomUUID(), nama: 'Orange' },
];

export default function WarnaForm(props: FormProps<WarnaForm>) {
  const { onSubmit, onCancel } = props;
  const [warnaIds, setWarnaIds] = React.useState<string[]>([]);

  const handleWarnaCheckbox = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    colorId: string,
  ) =>
    setWarnaIds(prev => {
      return Array.from(
        new Set(
          (e.target as HTMLInputElement).checked
            ? [...prev, colorId]
            : prev.filter(id => id !== colorId),
        ),
      );
    });

  return (
    <Box
      component="form"
      onSubmit={async e => {
        e.preventDefault();

        await onSubmit({ warnaIds });
      }}
    >
      <DialogContent>
        <Stack gap={1}>
          {colors.map(color => {
            return (
              <FormControlLabel
                key={color.id}
                label={color.nama}
                control={
                  <Checkbox
                    onClick={e => handleWarnaCheckbox(e, color.id)}
                    value={warnaIds.includes(color.id)}
                  />
                }
              />
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button type="button" color="error" onClick={onCancel}>
          Batal
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
  );
}
