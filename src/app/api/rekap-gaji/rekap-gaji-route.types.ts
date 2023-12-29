import { RekapGajiKaryawan } from '@prisma/client';
import { GETPaginatedResponse } from '../responses.types';

export type RekapGajiGETResponse = GETPaginatedResponse<RekapGajiKaryawan[]>;
