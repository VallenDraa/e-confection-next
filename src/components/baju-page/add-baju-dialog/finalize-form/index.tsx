'use client';

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Skeleton,
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
import { useSize } from '@/hooks/server-state-hooks/use-size';
import { FloatingAlert } from '@/components/ui/floating-alert';
import { createRekapGajiList } from '@/lib/rekap-gaji-karyawan';

export type FinalizeFormProps = {
  newSeriProduksi: NewSeriProduksi;
} & FormProps<NewSeriProduksi>;

export default function FinalizeForm(props: FinalizeFormProps) {
  const { onSubmit, onCancel, newSeriProduksi } = props;

  const [localNewSeriProduksi, setLocalNewSeriProduksi] =
    React.useState<NewSeriProduksi>(newSeriProduksi);

  const [alertMessage, setAlertMessage] = React.useState('');
  const {
    queryResultBeforeComma: {
      data: sizeBeforeCommaResult,
      error: sizeBeforeCommaError,
      isLoading: sizeBeforeCommaIsLoading,
    },
    queryResultAfterComma: {
      data: sizeAfterCommaResult,
      error: sizeAfterCommaError,
      isLoading: sizeAfterCommaIsLoading,
    },
  } = useSize({
    onError() {
      setAlertMessage(
        sizeBeforeCommaError?.message ?? sizeAfterCommaError?.message ?? '',
      );
      setTimeout(() => setAlertMessage(''), 3000);
    },
  });

  function disableSubmit() {
    const someGrupWarnaHasNoShirt = localNewSeriProduksi.grupWarnaList.some(
      grupWarnaBaju =>
        localNewSeriProduksi.bajuList.every(
          baju => baju.grupWarnaBajuId !== grupWarnaBaju.id,
        ),
    );

    return someGrupWarnaHasNoShirt;
  }

  async function onSubmitHandler() {
    await onSubmit(localNewSeriProduksi);
  }

  const handleGrupWarnaChange = React.useCallback(
    (incomingGrupWarna: NewGrupWarna, incomingBajuList: NewBaju[]) => {
      try {
        const editedSeriProduksi = { ...localNewSeriProduksi };
        const currGrupWarnaListLen = editedSeriProduksi.grupWarnaList.length;

        // Override grup warna data with new one
        for (let i = 0; i < currGrupWarnaListLen; i++) {
          const currGrupWarna = editedSeriProduksi.grupWarnaList[i];

          if (currGrupWarna.id === incomingGrupWarna.id) {
            editedSeriProduksi.grupWarnaList[i] = incomingGrupWarna;
            break;
          }
        }

        // Override baju data with new one
        editedSeriProduksi.bajuList = incomingBajuList;
        const currBajuListLen = editedSeriProduksi.bajuList.length;

        // Update rekap gaji karyawan
        const { rekapGajiList, bajuRekapGajiList } = createRekapGajiList(
          editedSeriProduksi.id,
          editedSeriProduksi.bajuList,
          sizeBeforeCommaResult?.data ?? [],
          sizeAfterCommaResult?.data ?? [],
        );

        editedSeriProduksi.rekapGajiList = rekapGajiList;

        // Insert newly created rekap gaji ids into each baju
        for (let i = 0; i < currBajuListLen; i++) {
          const baju = editedSeriProduksi.bajuList[i];
          const rekapGajiKaryawanId = bajuRekapGajiList.get(baju.id);

          if (!rekapGajiKaryawanId) {
            throw new Error(
              'Tidak bisa menemukan id rekap gaji, silahkan lapor ke developer!',
            );
          }

          baju.rekapGajiKaryawanId = rekapGajiKaryawanId;
        }

        setLocalNewSeriProduksi(editedSeriProduksi);
      } catch (error) {
        if (error instanceof Error) {
          setAlertMessage(error.message);
        } else {
          setAlertMessage('Gagal untuk mengupdate grup warna!');
        }

        setTimeout(() => setAlertMessage(''), 3000);
      }
    },
    [
      sizeBeforeCommaResult?.data,
      sizeAfterCommaResult?.data,
      localNewSeriProduksi,
    ],
  );

  return (
    <Box>
      {sizeBeforeCommaIsLoading || sizeAfterCommaIsLoading ? (
        <>
          <DialogContent sx={{ paddingBottom: 0 }}>
            <Skeleton width="100%" height={36} />
            <Skeleton width="100%" height={56} />
            <Skeleton width="100%" height={120} sx={{ mt: '12px' }} />
          </DialogContent>
          <DialogActions sx={{ paddingInline: '24px' }}>
            <Skeleton variant="rounded" width={66} height={36} />
            <Skeleton variant="rounded" width={132} height={36} />
          </DialogActions>
        </>
      ) : (
        <>
          <DialogContent>
            {localNewSeriProduksi.nama && (
              <Typography variant="h6">{localNewSeriProduksi.nama}</Typography>
            )}
            <Typography variant="h4">
              {localNewSeriProduksi.nomorSeri}
            </Typography>

            <Stack gap={2} mt={2}>
              {localNewSeriProduksi.grupWarnaList.map((grupWarnaBaju, i) => {
                return (
                  <GrupWarnaItem
                    key={i}
                    rekapGajiList={localNewSeriProduksi.rekapGajiList}
                    grupWarnaBaju={grupWarnaBaju}
                    onDataChange={handleGrupWarnaChange}
                    bajuList={localNewSeriProduksi.bajuList}
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
        </>
      )}

      <FloatingAlert
        isActive={alertMessage !== ''}
        onClose={() => setAlertMessage('')}
        severity="error"
      >
        {alertMessage}
      </FloatingAlert>
    </Box>
  );
}
