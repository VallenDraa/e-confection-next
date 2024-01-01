'use client';

import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import * as React from 'react';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Header } from '../../ui/header';
import { FloatingAlert } from '../../ui/floating-alert';
import { SeriProduksi } from '@prisma/client';
import { SeriProduksiWarnaAccordion } from './seri-produksi-warna-accordion';
import useGrupWarna from '@/hooks/server-state-hooks/use-grup-warna';

type SeriProduksiItemProps = {
  seriProduksi: SeriProduksi;
};

export function SeriProduksiItem(props: SeriProduksiItemProps) {
  const { seriProduksi } = props;

  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isAlertOn, setIsAlertOn] = React.useState(false);

  function onError() {
    setIsAlertOn(true);
    setTimeout(() => setIsAlertOn(false), 3000);
  }

  const {
    queryResult: {
      data: grupWarnaResult,
      error: grupWarnaError,
      isLoading: isGrupWarnaLoading,
    },
  } = useGrupWarna({ seriProduksiId: seriProduksi.id, onError });

  return (
    <>
      {/* Seri Produksi item horizontal card */}
      <Paper
        onClick={() => setIsDetailOpen(true)}
        component="button"
        elevation={2}
        sx={{
          border: 'none',
          padding: '12px',
          backgroundColor: grey[200],
          cursor: 'pointer',
          transition: '200ms ease-in background-color',
          '&:hover': {
            backgroundColor: grey[300],
          },
        }}
      >
        <Stack direction="row" alignItems="center" gap={3}>
          <Avatar variant="circular">
            <FolderIcon />
          </Avatar>

          <Stack direction="row" justifyContent="space-between" flexGrow={1}>
            <Stack flexGrow={1} gap={0.5}>
              {isGrupWarnaLoading ? (
                <>
                  <Skeleton
                    variant="rounded"
                    width="100%"
                    height={32}
                    sx={{ backgroundColor: grey[300] }}
                  />
                  <Skeleton
                    variant="rounded"
                    width="100%"
                    height={20}
                    sx={{ backgroundColor: grey[300] }}
                  />
                </>
              ) : (
                <>
                  <Typography
                    textAlign="start"
                    noWrap
                    variant="h6"
                    fontWeight="600"
                    component="h2"
                  >
                    {seriProduksi.nomorSeri}
                  </Typography>
                  <Typography
                    noWrap
                    textAlign="start"
                    variant="body2"
                    color={grey[600]}
                  >
                    {`${new Date(
                      seriProduksi.createdAt,
                    ).toLocaleDateString()} - ${
                      seriProduksi.nama || 'Tidak Ada Nama'
                    }`}
                  </Typography>
                </>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      {/* Seri Produksi detail dialog */}
      <Dialog
        fullWidth
        PaperProps={{ square: false }}
        open={isDetailOpen}
        onClose={setIsDetailOpen}
      >
        <Header>
          <Box display="flex" alignItems="center" width="100%" pl={1} pr={3}>
            <IconButton color="info" onClick={() => setIsDetailOpen(false)}>
              <ArrowBackIcon sx={{ fill: 'white' }} />
            </IconButton>

            <Typography
              component="h2"
              variant="h6"
              fontWeight={700}
              color={grey[200]}
            >
              {`Produksi No. ${seriProduksi.nomorSeri}`}
            </Typography>
          </Box>
        </Header>
        <DialogContent>
          <Paper sx={{ padding: '24px', backgroundColor: grey[100] }}>
            <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
              <Avatar
                variant="rounded"
                sx={{ aspectRatio: '1/1', height: '100%', width: '77px' }}
              >
                <FolderIcon sx={{ transform: 'scale(1.5)' }} />
              </Avatar>

              <Stack gap={1} flexGrow={1}>
                <TextField
                  fullWidth
                  label="Nomor Seri"
                  variant="standard"
                  size="medium"
                  value={seriProduksi.nomorSeri}
                  disabled={true}
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: grey[900],
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Nama Produksi"
                  variant="standard"
                  size="medium"
                  value={seriProduksi.nama || 'Tidak Ada Nama'}
                  disabled={true}
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: grey[900],
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Tanggal Produksi"
                  variant="standard"
                  size="medium"
                  value={new Date(seriProduksi.createdAt).toLocaleDateString()}
                  disabled={true}
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: grey[900],
                    },
                  }}
                />
              </Stack>
            </Stack>
          </Paper>

          <Typography
            fontWeight={700}
            variant="h6"
            mt={3}
            mb={1}
            component="h2"
          >
            List Warna Dan Baju
          </Typography>
          <Stack gap={2}>
            {grupWarnaResult?.data.map(grupWarna => (
              <SeriProduksiWarnaAccordion
                grupWarna={grupWarna}
                key={grupWarna.id}
              />
            ))}
          </Stack>
        </DialogContent>

        <FloatingAlert
          isActive={isAlertOn}
          onClose={() => setIsAlertOn(false)}
          severity="error"
        >
          {grupWarnaError?.message && grupWarnaError.message}
        </FloatingAlert>
      </Dialog>
    </>
  );
}
