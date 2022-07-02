import { RatesController } from '../controllers/rates';
import { WalletsController } from '../controllers/wallets';
import { getEnv, keys } from '../lib/env';
import { EtherscanImpl } from '../lib/etherscan';
import { RateInMemoryRepository } from '../repositories/rates';
import Big from 'big.js';

const etherscan = new EtherscanImpl(getEnv(keys.ETHERSCAN_API_KEY));
const rateRepository = new RateInMemoryRepository();

// initialize repository with sample data
rateRepository.put('ETH', 'USD', new Big('1.5'));
rateRepository.put('ETH', 'EUR', new Big('2'));

export const walletsController = new WalletsController(etherscan, rateRepository);
export const ratesController = new RatesController(rateRepository);
