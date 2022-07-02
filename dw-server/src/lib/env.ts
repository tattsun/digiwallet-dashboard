import { DwExceptionError } from './errors';

export const keys = {
  ETHERSCAN_API_KEY: 'ETHERSCAN_API_KEY',
};

export function getEnv(key: string) {
  const val = process.env[key];

  if (val === undefined) {
    throw new DwExceptionError(`Environment variable '${key}' is not defined`);
  }

  return val;
}
