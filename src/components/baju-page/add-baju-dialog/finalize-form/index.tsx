'use client';

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { FinalBajuData, FormProps } from '..';

export type FinalizeFormProps = {
  finalBajuData: FinalBajuData;
} & FormProps<FinalBajuData>;

export default function FinalizeForm(props: FinalizeFormProps) {
  const { onSubmit, onCancel, finalBajuData } = props;
  const [localFinalBajuData, setLocalFinalBajuData] =
    React.useState<FinalBajuData>(finalBajuData);

  async function onSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await onSubmit(localFinalBajuData);
  }

  return (
    <Box component="form" onSubmit={onSubmitHandler}>
      <DialogContent>
        <Typography variant="h3">{localFinalBajuData.nomorSeri}</Typography>
        <Stack gap={1}>
          {localFinalBajuData.data.map(size => {
            return size.warnaId;
          })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button type="button" color="error" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" variant="contained" color="success">
          Selanjutnya
        </Button>
      </DialogActions>
    </Box>
  );
}
