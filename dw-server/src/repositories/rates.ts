import Big from 'big.js';
import { Currency } from '../models/currency';

export interface RateRepository {
  put(from: Currency, to: Currency, rate: Big): Promise<void>;
  get(from: Currency, to: Currency): Promise<Big | undefined>;
}

export class RateInMemoryRepository {
  private store: { [key: string]: Big };

  constructor() {
    this.store = {};
  }

  async put(from: Currency, to: Currency, rate: Big) {
    this.store[`${from}_${to}`] = rate;
  }

  async get(from: Currency, to: Currency) {
    return this.store[`${from}_${to}`];
  }
}
