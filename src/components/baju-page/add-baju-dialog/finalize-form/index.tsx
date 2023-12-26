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
import { NewSeriProduksi, FormProps, NewGrupWarna } from '..';
import { GrupWarnaItem } from './grup-warna';

export type FinalizeFormProps = {
  newSeriProduksi: NewSeriProduksi;
} & FormProps<NewSeriProduksi>;

export default function FinalizeForm(props: FinalizeFormProps) {
  const { onSubmit, onCancel, newSeriProduksi } = props;

  const [localNewSeriProduksi, setLocalNewSeriProduksi] =
    React.useState<NewSeriProduksi>(newSeriProduksi);

  function disableSubmit() {
    return (
      newSeriProduksi.data.length === 0 ||
      newSeriProduksi.data.some(grupWarna => grupWarna.bajuList.length === 0)
    );
  }

  async function onSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await onSubmit(localNewSeriProduksi);
  }

  const handleGrupWarnaChange = React.useCallback(
    (grupWarna: NewGrupWarna, grupWarnaIdx: number) => {
      setLocalNewSeriProduksi(prev => {
        const newBajuFinalData = { ...prev };

        for (let i = 0; i < newBajuFinalData.data.length; i++) {
          if (i === grupWarnaIdx) {
            newBajuFinalData.data[i] = grupWarna;
            break;
          }
        }

        return newBajuFinalData;
      });
    },
    [],
  );

  return (
    <>
      <Box component="form" onSubmit={onSubmitHandler}>
        <DialogContent>
          {localNewSeriProduksi.nama && (
            <Typography variant="h6">{localNewSeriProduksi.nama}</Typography>
          )}
          <Typography variant="h4">{localNewSeriProduksi.nomorSeri}</Typography>

          <Stack gap={2} mt={2}>
            {localNewSeriProduksi.data.map((data, i) => {
              return (
                <GrupWarnaItem
                  key={i}
                  onDataChange={handleGrupWarnaChange}
                  grupWarna={data}
                  grupWarnaIdx={i}
                />
              );
            })}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="button" color="error" onClick={onCancel}>
            BATAL
          </Button>

          <Button
            type="submit"
            disabled={disableSubmit()}
            variant="contained"
            color="success"
          >
            TAMBAH
          </Button>
        </DialogActions>
      </Box>
    </>
  );
}
