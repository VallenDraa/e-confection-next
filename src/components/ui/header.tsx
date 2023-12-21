import { Box } from '@mui/material';
import React from 'react';

type HeaderType = 'primary' | 'danger';

type HeaderProps = {
  type?: HeaderType;
  children: React.ReactNode;
};

export function Header(props: HeaderProps) {
  const { children, type = 'primary' } = props;
  const backgroundColor: Record<HeaderType, string> = {
    primary:
      'linear-gradient(267.81deg, rgba(43, 52, 125, 1) -8.76%, rgba(78, 96, 239, 1) 104.43%)',
    danger: 'linear-gradient(269.57deg, #D22E2E -10.19%, #FF9676 122.35%)',
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      minHeight={60}
      width="100%"
      style={{
        background: backgroundColor[type],
      }}
    >
      {children}
    </Box>
  );
}
