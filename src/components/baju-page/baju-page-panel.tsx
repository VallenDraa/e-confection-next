'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
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
import { useSeriProduksi } from '@/hooks/use-seri-produksi';
import { SeriProduksiItem } from './seri-produksi-item';
import BajuPageSkeleton from './baju-page-skeleton';

export function BajuPagePanel() {
  const query = useSearchParams();
  const [bajuPage, setBajuPage] = React.useState(
    isNaN(Number(query.get('page'))) ? Number(query.get('page')) : 1,
  );

  const [isAlertOn, setIsAlertOn] = React.useState(false);

  const {
    queryResult: { data: result, error, isLoading },
    addSeriProduksi,
  } = useSeriProduksi({
    page: bajuPage,
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
            Daftar Baju
          </Typography>
        </Container>
      </Header>

      <Container maxWidth="sm">
        <Stack gap={2} my={2}>
          {isLoading && <BajuPageSkeleton />}

          {!isLoading && !result?.data && (
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
          )}

          {!isLoading &&
            result?.data &&
            result?.data?.length > 0 &&
            result?.data.map(seriProduksi => {
              return (
                <SeriProduksiItem
                  key={seriProduksi.id}
                  seriProduksi={seriProduksi}
                />
              );
            })}
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
        <AddBajuDialog
          onSubmit={async data => await addSeriProduksi.mutateAsync(data)}
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
        </AddBajuDialog>
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
