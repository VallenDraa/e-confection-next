import { Skeleton } from '@mui/material';
import React from 'react';

export function KaryawanPageSkeleton() {
  return (
    <>
      <Skeleton variant="rounded" width="100%" height={76} />
      <Skeleton variant="rounded" width="100%" height={76} />
      <Skeleton variant="rounded" width="100%" height={76} />
      <Skeleton variant="rounded" width="100%" height={76} />
      <Skeleton variant="rounded" width="100%" height={76} />
      <Skeleton variant="rounded" width="100%" height={76} />
    </>
  );
}
