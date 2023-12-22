'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Container,
  Pagination,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { Header } from '../ui/header';
import { grey } from '@mui/material/colors';
import { AddBajuDialog } from './add-baju-dialog';
import { FloatingAlert } from '../ui/floating-alert';

export function BajuPagePanel() {
  const query = useSearchParams();
  const [bajuPage, setBajuPage] = React.useState(query.get('page') ?? 1);

  const [isDeletingBaju, setIsDeletingBaju] = React.useState(false);
  const [toBeDeletedBaju, setToBeDeletedBaju] = React.useState<string[]>([]);

  const [isAlertOn, setIsAlertOn] = React.useState(false);
  function onError() {
    setIsAlertOn(true);
    setTimeout(() => setIsAlertOn(false), 3000);
  }

  const {
    data: result,
    error,
    isLoading,
  } = useQuery<any>({
    queryKey: ['baju', bajuPage],
    async queryFn() {
      try {
        // const { data } = await axios.get<KaryawanGET>(
        //   `/api/baju?page=${bajuPage}`,
        // );

        return [];
      } catch (error) {
        onError();

        return {
          data: [],
          metadata: { last: 0, current: 0, next: 0, prev: 0 },
        };
      }
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
            Daftar Baju
          </Typography>
        </Container>
      </Header>

      <Container maxWidth="sm">
        <Stack gap={2} my={2}>
          {isLoading &&
            new Array(5).map((a, i) => {
              return (
                <Skeleton key={i} variant="rounded" width="100%" height={76} />
              );
            })}

          {/* {!isLoading && result?.data && result?.data?.length > 0 ? (
            result?.data.map(baju => {
              return (
                <KaryawanItem
                  onEdit={editKaryawan.mutateAsync}
                  checkable={isDeletingBaju}
                  onChecked={isChecked => {
                    setToBeDeletedBaju(prev =>
                      isChecked
                        ? [...prev, baju.id]
                        : prev.filter(id => id !== baju.id),
                    );
                  }}
                  baju={baju}
                  key={baju.id}
                />
              );
            })
          ) : (
            <Typography
              textAlign="center"
              my={5}
              variant="subtitle1"
              color={grey[600]}
              fontWeight={500}
              component="p"
            >
              Belum ada baju.
            </Typography>
          )} */}
        </Stack>
      </Container>

      <Box
        position="fixed"
        bottom={65}
        right={16}
        gap={1}
        display="flex"
        flexDirection="column"
      >
        {isDeletingBaju ? (
          <>
            <Button
              onClick={() => setIsDeletingBaju(false)}
              variant="contained"
              color="success"
            >
              BATAL
            </Button>

            {/* <ConfirmDeleteDialog
              onDelete={async () =>
                await deleteKaryawan.mutateAsync(toBeDeletedBaju)
              }
            >
              {setOpen => (
                <Button
                  disabled={toBeDeletedBaju.length === 0}
                  onClick={() => setOpen(true)}
                  variant="contained"
                  color="error"
                >
                  HAPUS DATA
                </Button>
              )}
            </ConfirmDeleteDialog> */}
          </>
        ) : (
          <>
            <Button
              onClick={() => setIsDeletingBaju(true)}
              variant="contained"
              color="error"
            >
              HAPUS
            </Button>

            <AddBajuDialog onSubmit={async () => {}}>
              {setOpen => (
                <Button
                  onClick={() => setOpen(true)}
                  variant="contained"
                  color="success"
                >
                  TAMBAH
                </Button>
              )}
            </AddBajuDialog>
          </>
        )}
      </Box>

      <Box position="fixed" bottom={65} left={16}>
        <Pagination
          shape="rounded"
          onChange={(e, page) => setBajuPage(page)}
          count={result?.metadata?.last ?? 0}
          hidePrevButton
          hideNextButton
        />
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
