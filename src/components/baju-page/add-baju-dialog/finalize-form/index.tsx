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
import { FormProps } from '..';
import { GrupWarnaItem } from './grup-warna';
import { NewSeriProduksi } from '@/schema/seri-produksi.schema';
import { NewGrupWarna } from '@/schema/grup-warna.schema';
import { NewBaju } from '@/schema/baju.schema';
import { ConfirmAddDialog } from '@/components/ui/confirm-add-dialog';

export type FinalizeFormProps = {
  newSeriProduksi: NewSeriProduksi;
} & FormProps<NewSeriProduksi>;

export default function FinalizeForm(props: FinalizeFormProps) {
  const { onSubmit, onCancel, newSeriProduksi } = props;

  const [localNewSeriProduksi, setLocalNewSeriProduksi] =
    React.useState<NewSeriProduksi>(newSeriProduksi);

  function disableSubmit() {
    const someGrupWarnaHasNoShirt = localNewSeriProduksi.grupWarnaList.some(
      grupWarna =>
        localNewSeriProduksi.bajuList.every(
          baju => baju.grupWarnaBajuId !== grupWarna.id,
        ),
    );

    const someGrupWarnaHasNoKaryawan = localNewSeriProduksi.grupWarnaList.some(
      grupWarna => grupWarna.karyawanId === '',
    );

    return someGrupWarnaHasNoShirt || someGrupWarnaHasNoKaryawan;
  }

  async function onSubmitHandler() {
    await onSubmit(localNewSeriProduksi);
  }

  const handleGrupWarnaChange = React.useCallback(
    (incomingGrupWarna: NewGrupWarna, incomingBajuList: NewBaju[]) => {
      setLocalNewSeriProduksi(prev => {
        const editedSeriProduksi = { ...prev };
        const currGrupWarnaListLen = editedSeriProduksi.grupWarnaList.length;
        const currBajuListLen = editedSeriProduksi.bajuList.length;

        // Override grup warna data with new one
        for (let i = 0; i < currGrupWarnaListLen; i++) {
          const currGrupWarna = editedSeriProduksi.grupWarnaList[i];

          if (currGrupWarna.id === incomingGrupWarna.id) {
            editedSeriProduksi.grupWarnaList[i] = incomingGrupWarna;
            break;
          }
        }

        // Override baju data with new one
        if (currBajuListLen > 0) {
          for (let i = 0; i < currBajuListLen; i++) {
            const currentBaju = editedSeriProduksi.bajuList[i];

            for (const baju of incomingBajuList) {
              if (!editedSeriProduksi.bajuList.some(b => b.id === baju.id)) {
                editedSeriProduksi.bajuList.push(baju);
              } else if (currentBaju.id === baju.id) {
                editedSeriProduksi.bajuList[i] = baju;
              }
            }
          }
        } else {
          editedSeriProduksi.bajuList.push(...incomingBajuList);
        }

        return editedSeriProduksi;
      });
    },
    [],
  );

  return (
    <Box>
      <DialogContent>
        {localNewSeriProduksi.nama && (
          <Typography variant="h6">{localNewSeriProduksi.nama}</Typography>
        )}
        <Typography variant="h4">{localNewSeriProduksi.nomorSeri}</Typography>

        <Stack gap={2} mt={2}>
          {localNewSeriProduksi.grupWarnaList.map((grupWarna, i) => {
            const grupWarnaBajuList = localNewSeriProduksi.bajuList.filter(
              baju => baju.grupWarnaBajuId === grupWarna.id,
            );

            return (
              <GrupWarnaItem
                key={i}
                grupWarna={grupWarna}
                onDataChange={handleGrupWarnaChange}
                bajuList={grupWarnaBajuList}
              />
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button type="button" color="error" onClick={onCancel}>
          BATAL
        </Button>
        <ConfirmAddDialog onAdd={onSubmitHandler}>
          {setOpen => {
            return (
              <Button
                type="submit"
                disabled={disableSubmit()}
                onClick={() => setOpen(true)}
                variant="contained"
                color="success"
              >
                TAMBAH
              </Button>
            );
          }}
        </ConfirmAddDialog>
      </DialogActions>
    </Box>
  );
}
