import { Karyawan } from '@prisma/client';

export type KaryawanGET = {
  data: Karyawan[];
  metadata: {
    prev: number;
    current: number;
    next: number;
    last: number;
  };
};
