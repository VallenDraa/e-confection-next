'use client';

import * as React from 'react';
import { Header } from '@/components/ui/header';
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { KaryawanItem } from '@/components/karyawan-page/karyawan-item';
import { grey } from '@mui/material/colors';
import { AddKaryawanDialog } from '@/components/karyawan-page/add-karyawan-dialog';
import { FloatingAlert } from '@/components/ui/floating-alert';
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog';
import { useKaryawan } from '@/hooks/server-state-hooks/use-karyawan';
import { KaryawanPageSkeleton } from './karyawan-page-skeleton';

export function KaryawanPagePanel() {
  const query = useSearchParams();
  const [karyawanPage, setKaryawanPage] = React.useState(() => {
    const page = Number(query.get('page') ?? 1);

    return isNaN(page) ? 1 : page;
  });

  const [isDeletingKaryawan, setIsDeletingKaryawan] = React.useState(false);
  const [toBeDeletedKaryawan, setToBeDeletedKaryawan] = React.useState<
    string[]
  >([]);

  const [isAlertOn, setIsAlertOn] = React.useState(false);
  const {
    queryResult: { data: result, error, isLoading },
    addKaryawan,
    editKaryawan,
    deleteKaryawan,
  } = useKaryawan({
    karyawanPage,
    onError() {
      setIsAlertOn(true);
      setTimeout(() => setIsAlertOn(false), 3000);
    },
  });

  return (
    <Stack>
      <Header>
        <Container maxWidth="sm">
          <Typography
            color={grey[200]}
            variant="h5"
            fontWeight={700}
            component="h1"
          >
            Daftar Karyawan
          </Typography>
        </Container>
      </Header>

      <Container maxWidth="sm">
        <Stack gap={2} my={2} pb={12}>
          {isLoading && <KaryawanPageSkeleton />}

          {!isLoading &&
            result?.data &&
            result?.data?.length > 0 &&
            [
              ...result?.data,
              ...result?.data,
              ...result?.data,
              ...result?.data,
              ...result?.data,
              ...result?.data,
            ].map(karyawan => {
              return (
                <KaryawanItem
                  onEdit={editKaryawan.mutateAsync}
                  checkable={isDeletingKaryawan}
                  onChecked={isChecked => {
                    setToBeDeletedKaryawan(prev =>
                      isChecked
                        ? [...prev, karyawan.id]
                        : prev.filter(id => id !== karyawan.id),
                    );
                  }}
                  karyawan={karyawan}
                  key={karyawan.id}
                />
              );
            })}

          {!isLoading && (result?.data?.length === 0 || !result?.data) && (
            <Typography
              textAlign="center"
              my={5}
              variant="subtitle1"
              color={grey[600]}
              fontWeight={500}
              component="p"
            >
              Belum ada karyawan.
            </Typography>
          )}
        </Stack>
      </Container>

      <Box position="fixed" bottom={65} width="100%">
        <Container
          maxWidth="sm"
          sx={{
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
          }}
        >
          <Pagination
            shape="rounded"
            onChange={(e, page) => setKaryawanPage(page)}
            count={result?.metadata.last}
            hidePrevButton
            hideNextButton
          />

          <Box gap={1} display="flex" flexDirection="column">
            {isDeletingKaryawan ? (
              <>
                <Button
                  onClick={() => setIsDeletingKaryawan(false)}
                  variant="contained"
                  color="success"
                  size="small"
                >
                  BATAL
                </Button>

                <ConfirmDeleteDialog
                  onDelete={async () => {
                    await deleteKaryawan.mutateAsync(toBeDeletedKaryawan);
                    setIsDeletingKaryawan(false);
                  }}
                >
                  {setOpen => (
                    <Button
                      disabled={toBeDeletedKaryawan.length === 0}
                      onClick={() => setOpen(true)}
                      variant="contained"
                      color="error"
                      size="small"
                    >
                      HAPUS DATA
                    </Button>
                  )}
                </ConfirmDeleteDialog>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setIsDeletingKaryawan(true)}
                  variant="contained"
                  color="error"
                >
                  HAPUS
                </Button>

                <AddKaryawanDialog
                  onSubmit={async karyawan => {
                    await addKaryawan.mutateAsync(karyawan);
                    setIsDeletingKaryawan(false);
                  }}
                >
                  {setOpen => (
                    <Button
                      onClick={() => setOpen(true)}
                      variant="contained"
                      color="success"
                    >
                      TAMBAH
                    </Button>
                  )}
                </AddKaryawanDialog>
              </>
            )}
          </Box>
        </Container>
      </Box>

      {/* Alert message */}
      <FloatingAlert
        severity="error"
        isActive={isAlertOn}
        onClose={() => setIsAlertOn(false)}
      >
        {error?.message}
      </FloatingAlert>
    </Stack>
  );
}
