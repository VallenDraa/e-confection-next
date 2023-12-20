import { Box, Paper, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import React from 'react';

export type WorkHistoryItemProps = {
  noSeri: number;
  size: string;
  warna: string[];
  merek: string | null;
  gaji: number;
  createdAt: Date;
};

const rupiah = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount);

export function WorkHistoryItem(props: WorkHistoryItemProps) {
  const { gaji, merek, noSeri, size, warna, createdAt } = props;

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
        <Typography variant="body2" color={grey[600]}>
          {createdAt?.toLocaleDateString()}
        </Typography>
        <Stack mt={1} direction="row" justifyContent="space-between">
          {/* No seri and size */}
          <Stack direction="row" gap={0.5}>
            <Typography variant="h4" fontWeight={700}>
              {noSeri}
            </Typography>
            <Typography variant="h6" color={grey[600]}>
              {size}
            </Typography>
          </Stack>

          <Typography fontWeight={500} variant="h6">
            {merek}
          </Typography>
        </Stack>

        <Typography mt={3} fontWeight={500} variant="subtitle1">
          {warna?.join(', ')}
        </Typography>
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
          {rupiah(gaji)}
        </Typography>
      </Box>
    </Paper>
  );
}
