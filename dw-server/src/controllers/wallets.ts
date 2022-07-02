import { Etherscan } from '../lib/etherscan';
import { isEthereumAddress } from '../lib/customValidators';
import { Request, Response } from 'express';
import { ValidationError } from '../lib/errors';
import { ensureString } from '../lib/castutil';
import { getNow } from '../lib/datatime';
import Big from 'big.js';
import { Currency, isCurrency } from '../models/currency';
import { RateRepository } from '../repositories/rates';

export class WalletsController {
  constructor(private etherscan: Etherscan, private rateRepository: RateRepository) {}

  async getBalance(req: Request, res: Response) {
    // Validation
    const address = req.params.address;
    if (!isEthereumAddress(address)) {
      throw new ValidationError('invalid params: address');
    }
    const currency = req.query.currency as string;
    if (!isCurrency(currency)) {
      throw new ValidationError('invalid params: currency');
    }

    // Get rate
    const rate = await this.rateRepository.get('ETH', currency as Currency);
    if (!rate) {
      throw new ValidationError('rate not found');
    }

    // Call Etherscan
    const balance = await this.etherscan.getBalance({
      address: ensureString(address),
    });
    const eth = new Big(balance.result).div(1000000000000000000);

    // Response
    res.json({ balance: eth.mul(rate).round(0) });
  }

  async getIsOld(req: Request, res: Response) {
    // Validation
    const { address } = req.params;
    if (!isEthereumAddress(address)) {
      throw new ValidationError('invalid params: address');
    }

    // Call Etherscan
    const transactions = await this.etherscan.getTransactions({
      address: ensureString(address),
      sort: 'desc',
    });

    // Calculate duration between a latest transaction and current time
    if (transactions.result.length === 0) {
      res.json({ result: true });
      return;
    }
    const latestTxTimestamp = new Date(Number.parseInt(transactions.result[0].timeStamp) * 1000);
    const duration = getNow().getTime() - latestTxTimestamp.getTime();

    // Response
    res.json({ result: duration > 1000 * 60 * 60 * 24 * 365 });
  }
}
