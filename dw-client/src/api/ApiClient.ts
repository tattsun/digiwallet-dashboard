/* eslint-disable class-methods-use-this */

import { Currency } from '../consts/currencies';

function baseUrl() {
  const url = process.env.REACT_APP_API_BASEURL;
  if (url === undefined) {
    throw new Error('REACT_APP_API_BASEURL is not defined');
  }
  return url;
}

export class ApiClient {
  async getRate(from: Currency, to: Currency): Promise<{ rate: string }> {
    const queryParams = new URLSearchParams({
      from,
      to,
    });
    const res = await fetch(`${baseUrl()}/v1/rates?${queryParams.toString()}`);
    if (!res.ok) {
      throw new Error('API call failed');
    }
    return (await res.json()) as { rate: string };
  }

  async putRate(from: Currency, to: Currency, rate: string): Promise<void> {
    const body = {
      rate,
    };
    const queryParams = new URLSearchParams({
      from,
      to,
    });
    const res = await fetch(`${baseUrl()}/v1/rates?${queryParams.toString()}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error('API call failed');
    }
  }

  async getBalance(address: string, currency: Currency): Promise<{ balance: string }> {
    const queryParams = new URLSearchParams({
      currency,
    });
    const res = await fetch(`${baseUrl()}/v1/wallets/${address}/balance?${queryParams.toString()}`);
    if (!res.ok) {
      throw new Error('API call failed');
    }
    return (await res.json()) as { balance: string };
  }

  async getWalletIsOld(address: string): Promise<{ result: boolean } | null> {
    const res = await fetch(`${baseUrl()}/v1/wallets/${address}/is_old`);
    if (res.status === 404) {
      return null;
    }
    if (!res.ok) {
      throw new Error('API call failed');
    }
    return (await res.json()) as { result: boolean };
  }
}

export const apiClient = new ApiClient();
