'use client';

import { Box, Dialog, Typography } from '@mui/material';
import * as React from 'react';
import { Header } from '../../ui/header';
import { grey } from '@mui/material/colors';
import SeriProduksiForm from './seri-produksi-form';
import WarnaForm from './warna-form';
import FinalizeForm from './finalize-form';
import { useMultistepForm } from '@/hooks/use-multistep-form';
import {
  NewSeriProduksi,
  newSeriProduksiSchema,
} from '@/schema/seri-produksi.schema';
import { FloatingAlert } from '@/components/ui/floating-alert';
import { useBajuFormStore } from '@/store/baju-form-store/baju-form-store';

export type FormProps<T extends unknown | unknown[]> = {
  onCancel?: (data: T) => void;
  onSubmit: (data: T) => Promise<void>;
};

type AddBajuDialogProps<T> = {
  children: (
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) => React.ReactNode;
  onCancel?: () => void;
} & FormProps<T>;

export function AddBajuDialog(props: AddBajuDialogProps<NewSeriProduksi>) {
  const { children, onSubmit, onCancel } = props;
  const [alertMessage, setAlertMessage] = React.useState('');
  const bajuStore = useBajuFormStore();

  const [open, setOpen] = React.useState(false);
  const { next, back, step, goTo } = useMultistepForm([
    <SeriProduksiForm
      key={0}
      onCancel={seriData => {
        bajuStore.overrideSeriProduksi(seriData.nama, seriData.nomorSeri);

        onCancel?.();
        setOpen(false);
      }}
      onSubmit={async seriData => {
        bajuStore.overrideSeriProduksi(seriData.nama, seriData.nomorSeri);
        next();
      }}
    />,
    <WarnaForm
      key={1}
      onCancel={warnaData => {
        bajuStore.overrideGrupWarnaList(
          warnaData.warnaIds,
          bajuStore.formData.seriProduksi,
        );

        back();
      }}
      onSubmit={async warnaData => {
        bajuStore.overrideGrupWarnaList(
          warnaData.warnaIds,
          bajuStore.formData.seriProduksi,
        );

        next();
      }}
    />,
    <FinalizeForm
      key={2}
      onCancel={finalizeData => {
        bajuStore.overrideData(finalizeData);
        back();
      }}
      onSubmit={async data => {
        onSubmit(data);
        setOpen(false);
        goTo(0);
        bajuStore.resetFormData();
      }}
    />,
  ]);

  return (
    <>
      {children(setOpen)}

      <Dialog
        fullWidth
        PaperProps={{ square: false }}
        open={open}
        onClose={setOpen}
      >
        <Header>
          <Box display="flex" alignItems="center" px={3}>
            <Typography
              component="h2"
              variant="h6"
              fontWeight={700}
              color={grey[200]}
            >
              Tambah Baju
            </Typography>
          </Box>
        </Header>
        {step}
        <FloatingAlert
          isActive={alertMessage !== ''}
          onClose={() => setAlertMessage('')}
          severity="error"
        >
          {alertMessage}
        </FloatingAlert>
      </Dialog>
    </>
  );
}
