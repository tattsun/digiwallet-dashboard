import { DwExceptionError } from './errors';

export function ensureString(val: unknown): string {
  if (typeof val !== 'string') {
    throw new DwExceptionError('value is not string');
  }

  return val;
}
