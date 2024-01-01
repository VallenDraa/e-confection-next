import * as React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';

export type NumberInputProps = TextFieldProps & {
  noNegative?: boolean;
};

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ noNegative = false, ...props }, ref) => {
    return (
      <TextField
        {...props}
        ref={ref}
        onKeyDown={e => {
          if (
            !/^(Tab|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|Backspace|\d*)$/.test(
              e.key,
            ) ||
            (noNegative && e.key === '-')
          ) {
            e.preventDefault();
          }

          props.onKeyDown?.(e);
        }}
        onChange={e => {
          const value = (e.target as HTMLInputElement).valueAsNumber;

          if (value < 0) {
            e.target.value = '0';
          }

          props.onChange?.(e);
        }}
        type="number"
      />
    );
  },
);

NumberInput.displayName = 'NumberInput';
