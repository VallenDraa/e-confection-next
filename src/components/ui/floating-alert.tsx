import { Alert, AlertProps, Fade } from '@mui/material';
import * as React from 'react';

type FloatingAlertProps = {
  isActive: boolean;
} & AlertProps;

export function FloatingAlert(props: FloatingAlertProps) {
  const { isActive, children, ...others } = props;

  return (
    <Fade in={isActive}>
      <Alert
        {...others}
        sx={{
          ...others.sx,
          zIndex: 1100,
          position: 'fixed',
          right: '20px',
          bottom: '20px',
          width: 'max-content',
          '@media (max-width:600px)': {
            width: 'calc(100% - 40px)',
          },
        }}
      >
        {children}
      </Alert>
    </Fade>
  );
}
