import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Skeleton,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BajuTable } from '../add-baju-dialog/finalize-form/baju-table';
import { FloatingAlert } from '../../ui/floating-alert';
import { useSize } from '@/hooks/server-state-hooks/use-size';
import { useMerek } from '@/hooks/server-state-hooks/use-merek';
import { useKaryawan } from '@/hooks/server-state-hooks/use-karyawan';
import { useBaju } from '@/hooks/server-state-hooks/use-baju';
import { useWarna } from '@/hooks/server-state-hooks/use-warna';
import * as React from 'react';
import { GrupWarnaBaju } from '@prisma/client';
import { useRekapGaji } from '@/hooks/server-state-hooks/use-rekap-gaji';
import { findWarnaById } from '@/lib/warna';

export type SeriProduksiWarnaAccordionProps = {
  grupWarna: GrupWarnaBaju;
};

export function SeriProduksiWarnaAccordion(
  props: SeriProduksiWarnaAccordionProps,
) {
  const { grupWarna } = props;
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
    queryResultBeforeComma: {
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
      data: previewKaryawanResult,
      error: previewKaryawanError,
      isLoading: isKaryawanLoading,
    },
  } = useKaryawan({ onError });

  const {
    queryResult: {
      data: bajuResult,
      error: bajuError,
      isLoading: isBajuLoading,
    },
  } = useBaju({
    queryKey: { grupWarnaBajuId: grupWarna.id },
  });

  const {
    queryResultByGrupWarna: {
      data: rekapGajiResult,
      error: rekapGajiError,
      isLoading: isRekapGajiLoading,
    },
  } = useRekapGaji({
    rekapGajiByGrupWarna: { id: grupWarna.id },
  });

  const isLoading =
    isWarnaLoading ||
    isSizeLoading ||
    isMerekLoading ||
    isKaryawanLoading ||
    isBajuLoading ||
    isRekapGajiLoading;

  const currentWarna = findWarnaById(
    grupWarna.warnaId,
    warnaResult?.data ?? [],
  );

  return (
    <>
      <Accordion
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
            pr={2}
          >
            {/* Warna title */}
            <Box display="flex" alignItems="center" gap={1}>
              {isLoading ? (
                <>
                  <Skeleton variant="rounded" height={30} width={30} />
                  <Skeleton variant="rounded" height={30} width="100%" />
                </>
              ) : (
                <>
                  <Box
                    height={30}
                    width={30}
                    borderRadius="50%"
                    bgcolor={currentWarna?.kodeWarna ?? 'transparent'}
                  />

                  <Typography variant="h5">{currentWarna?.nama}</Typography>
                </>
              )}
            </Box>
          </Box>
        </AccordionSummary>

        <AccordionDetails>
          <BajuTable
            rekapGajiKaryawan={rekapGajiResult?.data ?? []}
            grupWarnaBajuId={grupWarna.id}
            bajuList={bajuResult?.data ?? []}
            previewKaryawanList={previewKaryawanResult?.data ?? []}
            sizeList={sizeResult?.data ?? []}
            merekList={merekResult?.data ?? []}
          />
        </AccordionDetails>
      </Accordion>

      <FloatingAlert
        isActive={isAlertOn}
        onClose={() => setIsAlertOn(false)}
        severity="error"
      >
        {rekapGajiError?.message && rekapGajiError.message}
        {previewKaryawanError?.message && previewKaryawanError.message}
        {sizeError?.message && sizeError.message}
        {sizeError?.message && sizeError.message}
        {merekError?.message && merekError.message}
        {bajuError?.message && bajuError.message}
        {warnaError?.message && warnaError.message}
      </FloatingAlert>
    </>
  );
}
