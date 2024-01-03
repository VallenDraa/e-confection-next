import { Checkbox, FormControlLabel } from '@mui/material';
import * as React from 'react';

export type NamedCheckboxProps = {
  labelFullWidth?: boolean;
  label: string;
  onChange(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  value: boolean;
};

export function NamedCheckbox(props: NamedCheckboxProps) {
  const { label, onChange, value, labelFullWidth } = props;

  return (
    <FormControlLabel
      label={label}
      sx={{ flexGrow: labelFullWidth ? 1 : 'initial' }}
      control={<Checkbox onClick={onChange} checked={value} />}
    />
  );
}
