import { Box } from '@mui/material';

export type ColorCircle = {
  bgColor: string;
  height?: number;
  width?: number;
  borderRadius?: string | number;
};

export function ColorCircle(props: ColorCircle) {
  const { bgColor, borderRadius, height, width } = props;

  return (
    <Box
      height={height ?? 30}
      width={width ?? 30}
      borderRadius={borderRadius ?? '50%'}
      bgcolor={bgColor}
    />
  );
}
