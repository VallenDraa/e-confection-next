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

export type FormProps<T extends unknown | unknown[]> = {
  onCancel?: () => void;
  onSubmit: (data: T) => Promise<void>;
};

type AddBajuDialogProps<T> = {
  children: (
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) => React.ReactNode;
  onCancel?: () => void;
} & FormProps<T>;

function getDefaultSeriProduksi(): NewSeriProduksi {
  return {
    id: crypto.randomUUID(),
    nama: null,
    nomorSeri: 0,
    grupWarnaList: [],
    bajuList: [],
    rekapGajiList: [],
  };
}

export function AddBajuDialog(props: AddBajuDialogProps<NewSeriProduksi>) {
  const { children, onSubmit, onCancel } = props;
  const [alertMessage, setAlertMessage] = React.useState('');
  const newSeriProduksiRef = React.useRef<NewSeriProduksi>(
    getDefaultSeriProduksi(),
  );

  const [open, setOpen] = React.useState(false);
  const { next, back, step, goTo } = useMultistepForm([
    <SeriProduksiForm
      key={0}
      onCancel={() => {
        onCancel?.();
        setOpen(false);
      }}
      onSubmit={async seriData => {
        newSeriProduksiRef.current = {
          ...newSeriProduksiRef.current,
          nama: seriData.nama,
          nomorSeri: seriData.nomorSeri,
        };

        next();
      }}
    />,
    <WarnaForm
      key={1}
      onCancel={() => back()}
      onSubmit={async warnaData => {
        newSeriProduksiRef.current = {
          ...newSeriProduksiRef.current,
          grupWarnaList: warnaData.warnaIds.map(warnaId => ({
            id: crypto.randomUUID(),
            seriProduksiId: newSeriProduksiRef.current.id,
            warnaId,
            karyawanId: '',
          })),
        };

        next();
      }}
    />,
    <FinalizeForm
      key={2}
      newSeriProduksi={newSeriProduksiRef.current}
      onCancel={() => back()}
      onSubmit={async data => {
        newSeriProduksiRef.current = data;

        const parsingResult = await newSeriProduksiSchema.safeParseAsync(
          newSeriProduksiRef.current,
        );

        if (parsingResult.success) {
          onSubmit(newSeriProduksiRef.current);
          setOpen(false);
          goTo(0);
          newSeriProduksiRef.current = getDefaultSeriProduksi();
        } else {
          setAlertMessage('Gagal untuk menambahkan seri produksi baru!');
          setTimeout(() => setAlertMessage(''), 3000);
        }
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
