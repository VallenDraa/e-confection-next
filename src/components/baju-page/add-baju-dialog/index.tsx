'use client';

import { Box, Dialog, Typography } from '@mui/material';
import * as React from 'react';
import { Header } from '../../ui/header';
import { grey } from '@mui/material/colors';
import SeriProduksiForm from './seri-produksi-form';
import WarnaForm from './warna-form';
import FinalizeForm from './finalize-form';
import { useMultistepForm } from '@/hooks/use-multistep-form';

export type FormProps<T extends unknown | unknown[]> = {
  onCancel: () => void;
  onSubmit: (data: T) => Promise<void>;
};

export type NewBaju = {
  merekId: string;
  sizeId: string;
  jmlDepan: number;
  jmlBelakang: number;
};

export type NewGrupWarna = {
  warnaId: string;
  karyawanId: string;
  bajuList: NewBaju[];
};

export type NewSeriProduksi = {
  nama: string | null;
  nomorSeri: number;
  data: NewGrupWarna[];
};

const DEFAULT_FINAL_DATA: NewSeriProduksi = {
  nama: null,
  nomorSeri: 0,
  data: [],
};

type AddBajuDialogProps<T> = {
  children: (
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) => React.ReactNode;
  onCancel?: () => void;
} & FormProps<T>;

export function AddBajuDialog<T>(props: AddBajuDialogProps<T>) {
  const { children } = props;
  const [newSeriProduksi, setNewSeriProduksi] =
    React.useState<NewSeriProduksi>(DEFAULT_FINAL_DATA);

  const [open, setOpen] = React.useState(false);
  const { next, back, step } = useMultistepForm([
    <SeriProduksiForm
      key={0}
      onCancel={() => setOpen(false)}
      onSubmit={async seriData => {
        setNewSeriProduksi(prev => ({
          ...prev,
          nama: seriData.nama,
          nomorSeri: seriData.nomorSeri,
        }));

        next();
      }}
    />,
    <WarnaForm
      key={1}
      onCancel={() => back()}
      onSubmit={async warnaData => {
        setNewSeriProduksi(prev => ({
          ...prev,
          data: warnaData.warnaIds.map(warnaId => ({
            warnaId,
            karyawanId: '',
            sizeId: '',
            bajuList: [],
          })),
        }));

        next();
      }}
    />,
    <FinalizeForm
      key={2}
      newSeriProduksi={newSeriProduksi}
      onCancel={() => back()}
      onSubmit={async data => {}}
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
      </Dialog>
    </>
  );
}
