import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as React from 'react';
import { FloatingAlert } from '@/components/ui/floating-alert';
import { useKaryawan } from '@/hooks/server-state-hooks/use-karyawan';
import { useWarna } from '@/hooks/server-state-hooks/use-warna';
import { useMerek } from '@/hooks/server-state-hooks/use-merek';
import { useSize } from '@/hooks/server-state-hooks/use-size';
import { BajuTable } from './baju-table';
import { grey } from '@mui/material/colors';
import { NewGrupWarna } from '@/schema/grup-warna.schema';
import { NewBaju } from '@/schema/baju.schema';
import { NewRekapGaji } from '@/schema/rekap-gaji.schema';
import { SizeInputDialog } from '../size-input-dialog';

type GrupWarnaItemProps = {
  grupWarnaBaju: NewGrupWarna;
  bajuList: NewBaju[];
  rekapGajiList: NewRekapGaji[];
  onDataChange(grupWarnaBaju: NewGrupWarna, bajuList: NewBaju[]): void;
};

function getDefaultNewBaju(
  seriProduksiId: string,
  grupWarnaBajuId: string,
  warnaId: string,
): NewBaju {
  return {
    id: crypto.randomUUID(),
    seriProduksiId,
    grupWarnaBajuId,
    warnaId,
    karyawanId: '',
    jumlahBelakang: 0,
    jumlahDepan: 0,
    merekId: null,
    rekapGajiKaryawanId: '',
    sizeId: '',
  };
}

export function GrupWarnaItem(props: GrupWarnaItemProps) {
  const { grupWarnaBaju, bajuList, rekapGajiList, onDataChange } = props;

  const filteredBajuList = bajuList.filter(
    baju => baju.grupWarnaBajuId === grupWarnaBaju.id,
  );

  const [isAlertOn, setIsAlertOn] = React.useState(false);
  function onError() {
    setIsAlertOn(true);
    setTimeout(() => setIsAlertOn(false), 3000);
  }

  const {
    queryResult: { data: warnaResult, error: warnaError },
  } = useWarna({ onError });

  const {
    previewQueryResult: { data: previewKaryawanResult, error: karyawanError },
  } = useKaryawan({ karyawanPage: 1, onError });

  const {
    queryResult: { data: merekResult, error: merekError },
  } = useMerek({ onError });

  const {
    queryResultBeforeComma: { data: sizeResult, error: sizeError },
  } = useSize({ onError });

  const [isSizeInputDialogOpen, setIsSizeInputDialogOpen] =
    React.useState(false);
  const [newBaju, setNewBaju] = React.useState<NewBaju>(
    getDefaultNewBaju(
      grupWarnaBaju.seriProduksiId,
      grupWarnaBaju.id,
      grupWarnaBaju.warnaId,
    ),
  );

  const warnaItem = warnaResult?.data.find(
    warna => warna.id === grupWarnaBaju.warnaId,
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
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'end',
              gap: 2,
            }}
          >
            {/* Warna title */}
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                height={30}
                width={30}
                borderRadius="50%"
                bgcolor={warnaItem?.kodeWarna}
              />
              <Typography variant="h5">{warnaItem?.nama}</Typography>
            </Box>
          </Box>
        </AccordionSummary>

        <AccordionDetails>
          <BajuTable
            canDelete
            grupWarnaBajuId={grupWarnaBaju.id}
            rekapGajiKaryawan={rekapGajiList}
            bajuList={filteredBajuList}
            sizeList={sizeResult?.data ?? []}
            merekList={merekResult?.data ?? []}
            previewKaryawanList={previewKaryawanResult?.data ?? []}
            onBajuDelete={bajuId =>
              onDataChange(
                grupWarnaBaju,
                bajuList.filter(baju => baju.id !== bajuId),
              )
            }
          />

          {/* Karyawan */}
          <FormControl
            size="medium"
            fullWidth
            sx={{ marginTop: '32px', marginBottom: '16px' }}
          >
            <InputLabel id="karyawan">Yang Mengerjakan</InputLabel>
            <Select
              labelId="karyawan"
              variant="standard"
              size="medium"
              value={newBaju.karyawanId}
              onChange={e => {
                setNewBaju(prev => ({ ...prev, karyawanId: e.target.value }));
              }}
            >
              {previewKaryawanResult?.data.map(karyawan => (
                <MenuItem value={karyawan.id} key={karyawan.id}>
                  {karyawan.nama}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Add new baju to grup warna */}
          <Grid mb={2} container spacing={2}>
            {/* Merek */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="merek">Merek</InputLabel>
                <Select
                  variant="standard"
                  size="small"
                  label="Merek"
                  labelId="merek"
                  value={newBaju.merekId ?? 'addMerek'}
                  onChange={e => {
                    const newMerekId =
                      e.target.value && e.target.value === 'addMerek'
                        ? null
                        : e.target.value;

                    setNewBaju(prev => ({ ...prev, merekId: newMerekId }));
                  }}
                >
                  {merekResult?.data.map(merek => (
                    <MenuItem value={merek.id} key={merek.id}>
                      {merek.nama}
                    </MenuItem>
                  ))}

                  <MenuItem value="addMerek">Tambah Merek</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Size */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="size">Size</InputLabel>
                <Select
                  variant="standard"
                  label="Size"
                  size="small"
                  labelId="size"
                  value={newBaju.sizeId ?? 'addSize'}
                  onChange={e => {
                    const newSizeId =
                      e.target.value && e.target.value === 'addSize'
                        ? ''
                        : e.target.value;

                    if (e.target.value === 'addSize') {
                      setIsSizeInputDialogOpen(true);
                      return;
                    }

                    setNewBaju(prev => ({ ...prev, sizeId: newSizeId }));
                  }}
                >
                  {sizeResult?.data.map(size => (
                    <MenuItem value={size.id} key={size.id}>
                      {size.nama}
                    </MenuItem>
                  ))}

                  <MenuItem value="addSize">Tambah Size</MenuItem>
                </Select>
              </FormControl>

              <SizeInputDialog
                open={isSizeInputDialogOpen}
                onClose={setIsSizeInputDialogOpen}
              />
            </Grid>

            {/* jumlah depan */}
            <Grid item xs={12} sm={6}>
              <TextField
                variant="standard"
                fullWidth
                size="small"
                label="Jumlah Depan"
                type="number"
                value={newBaju.jumlahDepan}
                onChange={e =>
                  setNewBaju(prev => ({
                    ...prev,
                    jumlahDepan: (e.target as HTMLInputElement).valueAsNumber,
                  }))
                }
              />
            </Grid>

            {/* jumlah belakang */}
            <Grid item xs={12} sm={6}>
              <TextField
                variant="standard"
                fullWidth
                size="small"
                label="Jumlah Belakang"
                type="number"
                value={newBaju.jumlahBelakang}
                onChange={e =>
                  setNewBaju(prev => ({
                    ...prev,
                    jumlahBelakang: (e.target as HTMLInputElement)
                      .valueAsNumber,
                  }))
                }
              />
            </Grid>
          </Grid>

          <Button
            onClick={() => {
              onDataChange(grupWarnaBaju, [...bajuList, newBaju]);
              setNewBaju(
                getDefaultNewBaju(
                  grupWarnaBaju.seriProduksiId,
                  grupWarnaBaju.id,
                  grupWarnaBaju.warnaId,
                ),
              );
            }}
            fullWidth
            disabled={
              !newBaju.karyawanId ||
              !newBaju.sizeId ||
              newBaju.jumlahDepan === 0 ||
              newBaju.jumlahBelakang === 0
            }
            variant="contained"
          >
            Tambah
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Alert message */}
      <FloatingAlert
        severity="error"
        isActive={isAlertOn}
        onClose={() => setIsAlertOn(false)}
      >
        {merekError && merekError.message}
        {sizeError && sizeError.message}
        {warnaError && warnaError.message}
        {karyawanError && karyawanError.message}
      </FloatingAlert>
    </>
  );
}
