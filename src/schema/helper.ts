import * as z from 'zod';

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export const zodNumericString = z.preprocess(x => Number(x), z.number());
