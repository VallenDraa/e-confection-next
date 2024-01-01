import { Size } from '@prisma/client';
import { GETResponse } from '../responses.types';

export type SizeGETResponse = GETResponse<Size[]>;

export type SizeBody = {
  nama: string;
  softDelete: Date | null;
  hargaBeforeComma: number;
  hargaAfterComma: number;
};

export type SizeQueryType = 'before-comma' | 'after-comma';

export const AFTER_COMMA_SUFFIX = '_after_comma';
