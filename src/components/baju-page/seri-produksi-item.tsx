'use client';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import { Header } from '../ui/header';
import useWarna from '@/hooks/server-state-hooks/use-warna';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FloatingAlert } from '../ui/floating-alert';
import useSize from '@/hooks/server-state-hooks/use-size';
import { SeriProduksiData } from '@/app/api/seri-produksi/seri-produksi.types';
import { BajuTable } from './add-baju-dialog/finalize-form/baju-table';
import useMerek from '@/hooks/server-state-hooks/use-merek';
import useKaryawan from '@/hooks/server-state-hooks/use-karyawan';

type SeriProduksiItemProps = {
  seriProduksi: SeriProduksiData;
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
      data: warnaResult,
      error: warnaError,
      isLoading: isWarnaLoading,
    },
  } = useWarna({ onError });

  const {
    queryResult: {
      data: sizeResult,
      error: sizeError,
      isLoading: isSizeLoading,
    },
  } = useSize({ onError });

  const {
    queryResult: {
      data: merekResult,
      error: merekError,
      isLoading: isMerekLoading,
    },
  } = useMerek({ onError });

  const {
    previewQueryResult: {
      data: karyawanResult,
      error: karyawanError,
      isLoading: isKaryawanLoading,
    },
  } = useKaryawan({ karyawanPage: 1, onError });

  const isDataLoading =
    isWarnaLoading || isSizeLoading || isMerekLoading || isKaryawanLoading;

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
              {isDataLoading ? (
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
            {seriProduksi.grupWarnaBaju.map(grupWarna => {
              const warna = warnaResult?.data.find(
                warna => warna.id === grupWarna.warnaId,
              );

              return (
                <Accordion
                  key={grupWarna.id}
                  sx={{ backgroundColor: grey[50] }}
                  TransitionProps={{ unmountOnExit: true }}
                >
                  {/* Warna title and karyawan selector */}
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ backgroundColor: grey[200] }}
                  >
                    <Box
                      width="100%"
                      display="flex"
                      flexDirection="column"
                      gap={1}
                    >
                      {/* Warna title */}
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          height={30}
                          width={30}
                          borderRadius="50%"
                          bgcolor={warna?.kodeWarna ?? 'transparent'}
                        />
                        <Typography variant="h5">{warna?.nama}</Typography>
                      </Box>

                      {/* Karyawan */}
                      <Typography>
                        {`Dikerjakan Oleh: ${karyawanResult?.data.find(
                          karyawan => karyawan.id === grupWarna.karyawanId,
                        )?.nama}
                          `}
                      </Typography>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails>
                    <BajuTable
                      bajuList={grupWarna.baju}
                      sizeList={sizeResult?.data ?? []}
                      merekList={merekResult?.data ?? []}
                    />
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        </DialogContent>

        <FloatingAlert
          isActive={isAlertOn}
          onClose={() => setIsAlertOn(false)}
          severity="error"
        >
          {karyawanError?.message && karyawanError.message}
          {warnaError?.message && warnaError.message}
          {sizeError?.message && sizeError.message}
          {merekError?.message && merekError.message}
        </FloatingAlert>
      </Dialog>
    </>
  );
}
