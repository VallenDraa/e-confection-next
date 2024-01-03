import * as React from 'react';
import { Skeleton, Stack, Typography } from '@mui/material';
import { useRekapGaji } from '@/hooks/server-state-hooks/use-rekap-gaji';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RekapGajiItem } from './rekap-gaji-item';
import { ErrorBoundary } from '@/components/error-boundary';
import { grey } from '@mui/material/colors';
import { FloatingAlert } from '../ui/floating-alert';

type RekapGajiListProps = {
  karyawanId: string;
};

export function RekapGajiList(props: RekapGajiListProps) {
  const { karyawanId } = props;

  const [isAlertOn, setIsAlertOn] = React.useState(false);

  const {
    queryResultByKaryawan: {
      data,
      fetchNextPage,
      hasNextPage,
      isLoading,
      error,
    },
  } = useRekapGaji({
    rekapGajiByKaryawan: {
      id: karyawanId,
      initialPage: 1,
    },
    onError() {
      setIsAlertOn(true);
      setTimeout(() => setIsAlertOn(false), 3000);
    },
  });

  return (
    <>
      {isLoading ? (
        <Stack gap={2}>
          <Skeleton variant="rounded" width="100%" height={283} />
          <Skeleton variant="rounded" width="100%" height={283} />
        </Stack>
      ) : (
        <ErrorBoundary
          fallbackUI={
            <Typography
              textAlign="center"
              my={2}
              variant="subtitle1"
              color={grey[600]}
              fontWeight={500}
              component="p"
            >
              Terjadi kesalahan, silahkan refresh halaman
            </Typography>
          }
        >
          <InfiniteScroll
            hasMore={hasNextPage}
            next={fetchNextPage}
            dataLength={data?.pages?.length ?? 0}
            loader={<Skeleton variant="rounded" width="100%" height={212} />}
            endMessage={
              <Typography
                textAlign="center"
                my={2}
                variant="subtitle1"
                color={grey[600]}
                fontWeight={500}
                component="p"
              >
                {data?.pages[0].data?.length === 0
                  ? 'Belum ada rekap gaji.'
                  : 'Akhir rekap gaji.'}
              </Typography>
            }
            style={{
              flexGrow: 1,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {data?.pages.map((group, i) => {
              return (
                <React.Fragment key={i}>
                  {group.data.map((rekap, j) => (
                    <RekapGajiItem key={`${i}-${j}`} rekapGaji={rekap} />
                  ))}
                </React.Fragment>
              );
            })}
          </InfiniteScroll>
        </ErrorBoundary>
      )}

      <FloatingAlert
        isActive={isAlertOn}
        onClose={() => setIsAlertOn(false)}
        severity="error"
      >
        {error?.message && error?.message}
      </FloatingAlert>
    </>
  );
}
