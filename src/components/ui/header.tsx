import { Box } from '@mui/material';
import React from 'react';

type HeaderProps = {
  children: React.ReactNode;
};

export function Header(props: HeaderProps) {
  const { children } = props;

  return (
    <Box
      display="flex"
      alignItems="center"
      minHeight={60}
      width="100%"
      style={{
        background:
          'linear-gradient(267.81deg, rgba(43, 52, 125, 1) -8.76%, rgba(78, 96, 239, 1) 104.43%)',
      }}
    >
      {children}
    </Box>
  );
}
