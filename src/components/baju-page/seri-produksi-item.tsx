'use client';

import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import * as React from 'react';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SeriProduksi } from '@prisma/client';
import { Header } from '../ui/header';

type SeriProduksiItemProps = {
  seriProduksi: SeriProduksi;
};

export function SeriProduksiItem(props: SeriProduksiItemProps) {
  const { seriProduksi } = props;

  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  return (
    <>
      {/* Karyawan item horizontal card */}
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
          <Avatar alt="Avatar" variant="circular">
            <FolderIcon />
          </Avatar>

          <Stack direction="row" justifyContent="space-between" flexGrow={1}>
            <Stack>
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
                {`${new Date(seriProduksi.createdAt).toLocaleDateString()} - ${
                  seriProduksi.nama || 'Tidak Ada Nama'
                }`}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      {/* Karyawan detail dialog */}
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
              Daftar Karyawan
            </Typography>
          </Box>
        </Header>
        <Box height="100%" overflow="hidden">
          <DialogContent
            sx={{
              height: '100%',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Paper sx={{ padding: '24px', backgroundColor: grey[100] }}>
              <Stack direction="row" alignItems="center" gap={2}>
                <Avatar
                  variant="rounded"
                  sx={{ aspectRatio: '1/1', height: '100%', width: '77px' }}
                />

                <Stack gap={1}></Stack>
              </Stack>
            </Paper>

            <Typography
              fontWeight={700}
              variant="h6"
              mt={3}
              mb={1}
              component="h2"
            >
              Warna
            </Typography>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
}
