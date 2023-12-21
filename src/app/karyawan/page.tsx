'use client';

import * as React from 'react';
import { Header } from '@/components/ui/header';
import {
  Box,
  Button,
  Container,
  Pagination,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { KaryawanItem } from '@/components/karyawan-page/karyawan-item';
import { grey } from '@mui/material/colors';
import { AddKaryawanDialog } from '@/components/karyawan-page/add-karyawan-dialog';
import { FloatingAlert } from '@/components/ui/floating-alert';
import {
  KaryawanGET,
  KaryawanPUTBody,
} from '../api/karyawan/karyawan-route.types';
import { Karyawan } from '@prisma/client';
import { ConfirmDeleteDialog } from '@/components/karyawan-page/confirm-delete-dialog';

export default function KaryawanPage() {
  const session = useSession();
  const router = useRouter();
  const query = useSearchParams();
  const [karyawanPage, setKaryawanPage] = React.useState(
    query.get('page') ?? 1,
  );

  const [isDeletingKaryawan, setIsDeletingKaryawan] = React.useState(false);
  const [toBeDeletedKaryawan, setToBeDeletedKaryawan] = React.useState<
    string[]
  >([]);

  const [isAlertOn, setIsAlertOn] = React.useState(false);

  const queryClient = useQueryClient();
  const {
    data: result,
    error,
    isLoading,
  } = useQuery<KaryawanGET>({
    queryKey: ['karyawan', karyawanPage],
    async queryFn() {
      const { data } = await axios.get<KaryawanGET>(
        `/api/karyawan?page=${karyawanPage}`,
      );

      return data;
    },
  });

  function onError() {
    setIsAlertOn(true);
    setTimeout(() => setIsAlertOn(false), 3000);
  }

  const addKaryawan = useMutation({
    mutationKey: ['karyawan', karyawanPage],
    mutationFn: async (newKaryawan: Pick<Karyawan, 'nama' | 'telepon'>) => {
      await axios.post('/api/karyawan', newKaryawan);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['karyawan', karyawanPage] });
    },
    onError,
  });

  const editKaryawan = useMutation({
    mutationFn: async (newKaryawan: KaryawanPUTBody) => {
      await axios.put('/api/karyawan', newKaryawan);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['karyawan', karyawanPage] });
    },
    onError,
  });

  const deleteKaryawan = useMutation({
    mutationKey: ['karyawan', karyawanPage],
    mutationFn: async (karyawanIds: string[]) => {
      await axios.delete('/api/karyawan', { data: { ids: karyawanIds } });
    },
    onSuccess() {
      setToBeDeletedKaryawan([]);
      setIsDeletingKaryawan(false);

      queryClient.invalidateQueries({ queryKey: ['karyawan', karyawanPage] });
    },
    onError,
  });

  // if (!session.data) {
  //   router.push('/sign-in');
  // }

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
        <Stack gap={2} my={2}>
          {isLoading &&
            new Array(5).map((a, i) => {
              return (
                <Skeleton key={i} variant="rounded" width="100%" height={76} />
              );
            })}

          {!isLoading && result?.data && result?.data?.length > 0 ? (
            result?.data.map(karyawan => {
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
              Belum ada karyawan.
            </Typography>
          )}
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
        {isDeletingKaryawan ? (
          <>
            <Button
              onClick={() => setIsDeletingKaryawan(false)}
              variant="contained"
              color="success"
            >
              BATAL
            </Button>

            <ConfirmDeleteDialog
              onDelete={async () =>
                await deleteKaryawan.mutateAsync(toBeDeletedKaryawan)
              }
            >
              {setOpen => (
                <Button
                  disabled={toBeDeletedKaryawan.length === 0}
                  onClick={() => setOpen(true)}
                  variant="contained"
                  color="error"
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
              onSubmit={async karyawan =>
                await addKaryawan.mutateAsync(karyawan)
              }
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

      <Box position="fixed" bottom={65} left={16}>
        <Pagination
          shape="rounded"
          onChange={(e, page) => setKaryawanPage(page)}
          count={result?.metadata.last}
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
