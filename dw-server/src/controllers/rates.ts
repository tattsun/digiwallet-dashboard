import { RateRepository } from '../repositories/rates';
import { Request, Response } from 'express';
import validator from 'validator';
import { Currency, isCurrency } from '../models/currency';
import { NotFoundError, ValidationError } from '../lib/errors';
import Big from 'big.js';

export class RatesController {
  constructor(private rateRepository: RateRepository) {}

  async getRate(req: Request, res: Response) {
    // Validation
    const from = req.query.from as string;
    const to = req.query.to as string;
    if (!isCurrency(from) || !isCurrency(to) || from === to) {
      throw new ValidationError('invalid params: form, to');
    }

    // Get rate
    const rate = await this.rateRepository.get(from as Currency, to as Currency);
    if (!rate) {
      throw new NotFoundError();
    }

    // Response
    res.json({ rate: rate.toFixed().toString() });
  }

  async putRate(req: Request, res: Response) {
    // Validation
    const from = req.query.from as string;
    const to = req.query.to as string;
    if (!isCurrency(from) || !isCurrency(to) || from === to) {
      throw new ValidationError('invalid params: form, to');
    }
    const rate = req.body.rate;
    if (typeof rate !== 'string' || !validator.isNumeric(rate) || new Big(rate).lte(0)) {
      throw new ValidationError('invalid params: rate');
    }

    // Put rate
    const rateNum = new Big(rate);
    await this.rateRepository.put(from as Currency, to as Currency, rateNum);

    // Response
    res.json({ status: 'succeeded' });
  }
}
