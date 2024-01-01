import { Baju } from '@prisma/client';
import { GETResponse } from '../responses.types';

export type BajuGETResponse = GETResponse<Baju[]>;
