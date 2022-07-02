import fetch from 'node-fetch';
import { DwExceptionError } from './errors';

const baseUrl = 'https://api.etherscan.io/api';

export interface OutputBase {
  status: string;
  message: string;
}

export interface GetBalanceInput {
  address: string;
}

export interface GetBalanceOutput extends OutputBase {
  result: string;
}

export interface GetTransactionsInput {
  address: string;
  startBlock?: number;
  endBlock?: number;
  page?: number;
  offset?: number;
  sort?: 'asc' | 'desc';
}

export interface GetTransactionsOutput extends OutputBase {
  result: Array<Transaction>;
}

export interface Transaction {
  timeStamp: string;
}

export interface Etherscan {
  getBalance(input: GetBalanceInput): Promise<GetBalanceOutput>;
  getTransactions(input: GetTransactionsInput): Promise<GetTransactionsOutput>;
}

export class EtherscanImpl implements Etherscan {
  constructor(protected apiKey: string) {}

  private async execGet<I, O extends OutputBase>(input: I): Promise<O> {
    const queryString = new URLSearchParams({
      ...input,
      apikey: this.apiKey,
    });

    const url = `${baseUrl}?${queryString}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new DwExceptionError('failed to connect to Etherscan');
    }
    const json = (await res.json()) as O;
    if (json.status === '0') {
      throw new DwExceptionError('Etherscan response error: ' + JSON.stringify(json));
    }

    return json;
  }

  async getBalance(input: GetBalanceInput): Promise<GetBalanceOutput> {
    return await this.execGet({
      module: 'account',
      action: 'balance',
      tag: 'latest',
      ...input,
    });
  }

  async getTransactions(input: GetTransactionsInput): Promise<GetTransactionsOutput> {
    return await this.execGet({
      module: 'account',
      action: 'txlist',
      ...input,
    });
  }
}
