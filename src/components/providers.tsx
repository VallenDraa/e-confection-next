'use client';

import * as React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from '@mui/material/styles';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

let theme = createTheme();
theme = responsiveFontSizes(theme);

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
  },
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <SessionProvider>
      <QueryClientProvider client={client}>
        <ThemeProvider theme={theme}>
          {children}
          <ReactQueryDevtools />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
