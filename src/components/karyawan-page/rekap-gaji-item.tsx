import { Box, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import * as React from 'react';
import { ColorCircle } from '../ui/color-circle';
import { RekapGajiKaryawan } from '@prisma/client';
import { useBaju } from '@/hooks/server-state-hooks/use-baju';
import { FloatingAlert } from '../ui/floating-alert';
import { useMerek } from '@/hooks/server-state-hooks/use-merek';
import { useSize } from '@/hooks/server-state-hooks/use-size';
import { findMerekById } from '@/lib/merek';
import { findSizeById } from '@/lib/size';
import { findWarnaById } from '@/lib/warna';
import { useWarna } from '@/hooks/server-state-hooks/use-warna';
import { useSeriProduksi } from '@/hooks/server-state-hooks/use-seri-produksi';
import { rupiah } from '@/lib/formatter';

export type RekapGajiItemProps = {
  rekapGaji: RekapGajiKaryawan;
};

export function RekapGajiItem(props: RekapGajiItemProps) {
  const { rekapGaji } = props;

  const [isAlertOn, setIsAlertOn] = React.useState(false);

  function onError() {
    setIsAlertOn(true);
    setTimeout(() => setIsAlertOn(false), 3000);
  }

  const {
    queryResult: {
      data: bajuResult,
      isLoading: isBajuLoading,
      error: bajuError,
    },
  } = useBaju({
    queryKey: { rekapGajiKaryawanId: rekapGaji.id },
    onError,
  });

  const {
    queryResult: {
      data: merekResult,
      error: merekError,
      isLoading: isMerekLoading,
    },
  } = useMerek({ onError });

  const {
    queryResultBeforeComma: {
      data: sizeResult,
      error: sizeError,
      isLoading: isSizeLoading,
    },
  } = useSize({ onError });

  const {
    queryResult: {
      data: warnaResult,
      error: warnaError,
      isLoading: isWarnaLoading,
    },
  } = useWarna({ onError });

  const {
    individualQueryResult: {
      data: seriProduksiResult,
      error: seriProduksiError,
      isLoading: isSeriProduksiLoading,
    },
  } = useSeriProduksi({
    seriProduksiId: rekapGaji.seriProduksiId,
    onError,
  });

  const isLoading =
    isBajuLoading ||
    isMerekLoading ||
    isWarnaLoading ||
    isSizeLoading ||
    isSeriProduksiLoading;

  const currentMerek = React.useMemo(
    () =>
      rekapGaji.merekId && merekResult?.data
        ? findMerekById(rekapGaji.merekId, merekResult?.data)
        : null,
    [merekResult?.data, rekapGaji.merekId],
  );

  const currentSize = React.useMemo(
    () =>
      rekapGaji.sizeId && sizeResult?.data
        ? findSizeById(rekapGaji.sizeId, sizeResult?.data)
        : null,
    [sizeResult?.data, rekapGaji.sizeId],
  );

  const currentWarna = React.useMemo(
    () =>
      bajuResult?.data[0].warnaId && warnaResult?.data
        ? findWarnaById(bajuResult.data[0].warnaId, warnaResult?.data)
        : null,
    [warnaResult?.data, bajuResult?.data],
  );

  return (
    <Paper
      sx={{
        overflow: 'clip',
        width: '100%',
        backgroundColor: grey[100],
        padding: '0',
      }}
    >
      <Box p={2}>
        {isLoading ? (
          <>
            <Skeleton width="100%" height={20} />
          </>
        ) : (
          <Typography variant="body2" color={grey[600]}>
            {new Date(rekapGaji.createdAt)?.toLocaleDateString()}
          </Typography>
        )}

        {/* rekap gaji data */}
        <Stack
          mt={2}
          gap={1}
          direction="row"
          alignItems="end"
          justifyContent="space-between"
        >
          <Stack flexGrow={1} gap={1.5}>
            {isLoading ? (
              <>
                <Skeleton width="100%" height={36} />
                <Skeleton width="100%" height={32} />
              </>
            ) : (
              <>
                <Typography variant="h4" fontWeight={700}>
                  {seriProduksiResult?.data?.nomorSeri}
                </Typography>
                <Stack direction="row" alignItems="start" gap={0.5}>
                  <ColorCircle
                    width={25}
                    height={25}
                    bgColor={currentWarna?.kodeWarna ?? '#ffffff'}
                  />
                  <Typography fontWeight={500} variant="h6">
                    {currentWarna?.nama}
                  </Typography>
                </Stack>
              </>
            )}
          </Stack>

          <Stack flexGrow={1} gap={1} alignItems="end">
            {isLoading ? (
              <>
                <Skeleton width="100%" height={36} />
                <Skeleton width="100%" height={32} />
              </>
            ) : (
              <>
                <Typography
                  fontWeight={500}
                  color={currentMerek?.nama ? grey[900] : grey[400]}
                  variant="h6"
                >
                  {currentMerek?.nama || 'No Merek'}
                </Typography>
                <Typography variant="h6" color={grey[600]}>
                  {`Size: ${currentSize?.nama}`}
                </Typography>
              </>
            )}
          </Stack>
        </Stack>

        {/* baju data */}
        <Stack mt={2} gap={1}>
          {isLoading && (
            <Stack alignItems="center" gap={1}>
              <Skeleton variant="rounded" width="100%" height={28} />
              <Skeleton variant="rounded" width="100%" height={28} />
            </Stack>
          )}

          {!isLoading &&
            bajuResult?.data.map(baju => (
              <Stack key={baju.id}>
                <Typography variant="subtitle1" fontWeight={500}>
                  {`Jumlah Depan: ${baju.jumlahDepan}`}
                </Typography>
                <Typography variant="subtitle1" fontWeight={500}>
                  {`Jumlah Belakang: ${baju.jumlahDepan}`}
                </Typography>
              </Stack>
            ))}
        </Stack>
      </Box>

      <Box
        p={2}
        display="flex"
        justifyContent="space-between"
        color={grey[100]}
        sx={{
          background:
            'linear-gradient(267.81deg, rgba(43, 52, 125, 1) -8.76%, rgba(78, 96, 239, 1) 104.43%)',
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          GAJI
        </Typography>
        <Typography variant="h6" fontWeight={600}>
          {rupiah(rekapGaji.jumlahGaji)}
        </Typography>
      </Box>

      <FloatingAlert
        isActive={isAlertOn}
        onClose={() => setIsAlertOn(false)}
        severity="error"
      >
        {merekError && merekError.message}
        {sizeError && sizeError.message}
        {warnaError && warnaError.message}
        {seriProduksiError && seriProduksiError.message}
        {bajuError && bajuError.message}
      </FloatingAlert>
    </Paper>
  );
}
