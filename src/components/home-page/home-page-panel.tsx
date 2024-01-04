'use client';

import {
  Avatar,
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { Header } from '../ui/header';
import PersonIcon from '@mui/icons-material/Person';
import { grey } from '@mui/material/colors';
import { useSession } from 'next-auth/react';
import { Bar } from 'react-chartjs-2';
import {
  StatsTimePeriod,
  useChartData,
} from '@/hooks/server-state-hooks/use-chart-data';
import { FloatingAlert } from '../ui/floating-alert';

export function HomePagePanel() {
  const { data } = useSession();

  const [isAlertOn, setIsAlertOn] = React.useState(false);
  const [activeTimePeriod, setActiveTimePeriod] =
    React.useState<StatsTimePeriod>('Bulanan');

  const {
    produksiQueryResult: {
      data: produksiResult,
      isLoading: isProduksiLoading,
      error: produksiError,
    },
    rekapGajiQueryResult: {
      data: rekapGajiResult,
      isLoading: isRekapGajiLoading,
      error: rekapGajiError,
    },
  } = useChartData({
    timePeriod: activeTimePeriod,
    onError() {
      setIsAlertOn(true);
      setTimeout(() => setIsAlertOn(false), 3000);
    },
  });

  const isLoading = isProduksiLoading || isRekapGajiLoading;

  return (
    <Stack>
      <Header>
        <Container maxWidth="sm">
          <Box display="flex" gap={2} paddingTop={2}>
            <Avatar
              alt="Avatar"
              variant="circular"
              sx={{
                height: 54,
                width: 54,
                background: grey[100],
                boxShadow: 2,
              }}
            >
              <PersonIcon sx={{ fill: grey[900] }} />
            </Avatar>

            <Stack>
              <Typography
                color={grey[100]}
                variant="subtitle2"
                fontWeight="bold"
              >
                Nice to meet you!
              </Typography>
              <Typography color={grey[100]} variant="h5" fontWeight="bold">
                {data?.user.name}
              </Typography>
            </Stack>
          </Box>

          <Box
            boxShadow={2}
            marginTop={1.5}
            marginBottom={2}
            paddingBlock={1}
            paddingInline={2}
            borderRadius={20}
            bgcolor={grey[100]}
          >
            <FormControl fullWidth>
              <Select
                variant="standard"
                disableUnderline
                value={activeTimePeriod}
                onChange={e =>
                  setActiveTimePeriod(e.target.value as StatsTimePeriod)
                }
              >
                <MenuItem value="Mingguan">Statistik Mingguan</MenuItem>
                <MenuItem value="Bulanan">Statistik Bulanan</MenuItem>
                <MenuItem value="Tahunan">Statistik Tahunan</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Container>
      </Header>

      <Container maxWidth="sm" sx={{ pt: 2, pb: 4 }}>
        <Box display="flex" flexDirection="column">
          {isLoading || !rekapGajiResult?.data || !produksiResult?.data ? (
            <>
              <Skeleton width="100%" height={312} variant="rounded" />
              <Skeleton width="100%" height={312} variant="rounded" />
            </>
          ) : (
            <>
              <Box className="canvas-container">
                <Bar
                  data={produksiResult.data}
                  options={{
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: `Rekap Produksi ${activeTimePeriod}`,
                      },
                    },
                  }}
                />
              </Box>
              <Box className="canvas-container">
                <Bar
                  data={rekapGajiResult.data}
                  options={{
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: `Rekap Gaji ${activeTimePeriod}`,
                      },
                    },
                  }}
                />
              </Box>
            </>
          )}
        </Box>
      </Container>

      {/* Alert message */}
      <FloatingAlert
        severity="error"
        isActive={isAlertOn}
        onClose={() => setIsAlertOn(false)}
      >
        {produksiError && produksiError.message}
        {rekapGajiError && rekapGajiError.message}
      </FloatingAlert>
    </Stack>
  );
}
