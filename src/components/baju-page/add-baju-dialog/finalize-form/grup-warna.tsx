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
import useKaryawan from '@/hooks/use-karyawan';
import { FloatingAlert } from '@/components/ui/floating-alert';
import useWarna from '@/hooks/use-warna';
import useMerek from '@/hooks/use-merek';
import useSize from '@/hooks/use-size';
import { BajuTable } from './baju-table';
import { grey } from '@mui/material/colors';
import { NewGrupWarna } from '@/schema/grup-warna.schema';
import { NewBaju } from '@/schema/baju.schema';

type GrupWarnaItemProps = {
  grupWarna: NewGrupWarna;
  bajuList: NewBaju[];
  onDataChange(grupWarna: NewGrupWarna, bajuList: NewBaju[]): void;
};

function getDefaultNewBaju(grupWarnaBajuId: string): NewBaju {
  return {
    id: crypto.randomUUID(),
    grupWarnaBajuId,
    jumlahBelakang: 0,
    jumlahDepan: 0,
    merekId: null,
    sizeId: '',
  };
}

export function GrupWarnaItem(props: GrupWarnaItemProps) {
  const { grupWarna, bajuList, onDataChange } = props;

  const [isAlertOn, setIsAlertOn] = React.useState(false);
  function onError() {
    setIsAlertOn(true);
    setTimeout(() => setIsAlertOn(false), 3000);
  }

  const {
    queryResult: { data: warnaResult, error: warnaError },
  } = useWarna({ onError });

  const {
    previewQueryResult: {
      data: previewKaryawanResult,
      error: karyawanError,
      isLoading,
    },
  } = useKaryawan({ karyawanPage: 1, onError });

  const {
    queryResult: { data: merekResult, error: merekError },
  } = useMerek({ onError });

  const {
    queryResult: { data: sizeResult, error: sizeError },
  } = useSize({ onError });

  const [newBaju, setNewBaju] = React.useState<NewBaju>(
    getDefaultNewBaju(grupWarna.id),
  );

  const warnaItem = warnaResult?.data.find(
    warna => warna.id === grupWarna.warnaId,
  );
  const defaultKaryawanId = isLoading
    ? previewKaryawanResult?.data[0].id ?? ''
    : '';

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
          {/* Karyawan */}
          <FormControl size="medium" fullWidth sx={{ marginBlock: '16px' }}>
            <InputLabel id="karyawan">Yang Mengerjakan</InputLabel>
            <Select
              labelId="karyawan"
              variant="standard"
              size="medium"
              value={grupWarna.karyawanId || defaultKaryawanId}
              onChange={e =>
                onDataChange(
                  { ...grupWarna, karyawanId: e.target.value },
                  bajuList,
                )
              }
            >
              {previewKaryawanResult?.data.map(karyawan => (
                <MenuItem value={karyawan.id} key={karyawan.id}>
                  {karyawan.nama}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <BajuTable
            bajuList={bajuList}
            sizeList={sizeResult?.data ?? []}
            merekList={merekResult?.data ?? []}
            onBajuDelete={bajuId =>
              onDataChange(
                grupWarna,
                bajuList.filter(baju => baju.id !== bajuId),
              )
            }
          />

          {/* Add new baju to grup warna */}
          <Grid my={2} container spacing={2}>
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
              onDataChange(grupWarna, [...bajuList, newBaju]);
              setNewBaju(getDefaultNewBaju(grupWarna.id));
            }}
            fullWidth
            disabled={
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
