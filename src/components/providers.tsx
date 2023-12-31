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
