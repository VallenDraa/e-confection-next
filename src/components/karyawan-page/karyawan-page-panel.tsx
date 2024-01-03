'use client';

import * as React from 'react';
import { Header } from '@/components/ui/header';
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  Tab,
  Tabs,
  TextField,
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
import db from 'just-debounce';

type KaryawanTab = 'active' | 'deleted';

type QueryConfig = {
  search: string;
  activeTab: KaryawanTab;
  page: number;
};

export function KaryawanPagePanel() {
  const query = useSearchParams();

  const [isDeletingKaryawan, setIsDeletingKaryawan] = React.useState(false);
  const [toBeDeletedKaryawan, setToBeDeletedKaryawan] = React.useState<
    string[]
  >([]);

  const [isAlertOn, setIsAlertOn] = React.useState(false);

  const [localSearch, setLocalSearch] = React.useState(
    query.get('search') || '',
  );
  const [queryConfig, setQueryConfig] = React.useState<QueryConfig>(() => {
    const page = Number(query.get('page') || 1);
    const search = query.get('search') || '';

    return {
      search,
      page: isNaN(page) ? 1 : page,
      activeTab: 'active',
    };
  });
  const searchKaryawawan = React.useMemo(
    () =>
      db(
        (search: string) =>
          setQueryConfig(prev => ({ ...prev, search, page: 1 })),
        800,
      ),
    [],
  );

  React.useEffect(() => {}, [queryConfig]);

  const {
    activeQueryResult: {
      data: activeResult,
      error: activeResultError,
      isLoading: activeResultLoading,
    },
    deletedQueryResult: {
      data: deletedResult,
      error: deletedResultError,
      isLoading: deletedResultLoading,
    },
    addKaryawan,
    editKaryawan,
    deleteKaryawan,
  } = useKaryawan({
    activeQueryProps:
      queryConfig.activeTab === 'active'
        ? { search: queryConfig.search, page: queryConfig.page }
        : undefined,
    deletedQueryProps:
      queryConfig.activeTab === 'deleted'
        ? { search: queryConfig.search, page: queryConfig.page }
        : undefined,
    onError() {
      setIsAlertOn(true);
      setTimeout(() => setIsAlertOn(false), 3000);
    },
  });

  const isLoading = activeResultLoading || deletedResultLoading;
  const currentResult =
    queryConfig.activeTab === 'active' ? activeResult : deletedResult;

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
        <Box display="flex" gap={1} mt={1} flexDirection="column">
          <Tabs
            value={queryConfig.activeTab}
            onChange={(e, newTab: KaryawanTab) => {
              setLocalSearch('');
              setQueryConfig({ search: '', activeTab: newTab, page: 1 });
            }}
            aria-label="Karyawan Tabs"
          >
            <Tab
              label="Aktif"
              value="active"
              sx={{ flexGrow: 1, borderBottom: `1px solid ${grey[400]}` }}
            />
            <Tab
              label="Terhapus"
              value="deleted"
              sx={{ flexGrow: 1, borderBottom: `1px solid ${grey[400]}` }}
            />
          </Tabs>

          <TextField
            type="search"
            variant="standard"
            sx={{ flexGrow: 1 }}
            label="Cari Karyawan"
            value={localSearch}
            onChange={e => {
              setLocalSearch(e.target.value);
              searchKaryawawan(e.target.value);
            }}
          />
        </Box>

        <Stack gap={2} my={2} pb={12}>
          {isLoading && <KaryawanPageSkeleton />}

          {!isLoading &&
            currentResult?.data &&
            currentResult?.data?.length > 0 &&
            currentResult?.data.map(karyawan => {
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

          {!isLoading &&
            (currentResult?.data?.length === 0 || !currentResult?.data) && (
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
            onChange={(e, page) => setQueryConfig(prev => ({ ...prev, page }))}
            count={currentResult?.metadata.last}
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
        {activeResultError?.message && activeResultError?.message}
        {deletedResultError?.message && deletedResultError?.message}
      </FloatingAlert>
    </Stack>
  );
}
