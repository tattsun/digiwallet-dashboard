import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';

import walletRouter from './routers/wallets';
import ratesRouter from './routers/rates';
import { DwApplicationError } from './lib/errors';
import log4js from 'log4js';
import { accessLogger, logger } from './lib/loggers';

const app = express();
app.use(log4js.connectLogger(accessLogger, {}));
app.use(express.json());

app.use('/api/v1/wallets', walletRouter);
app.use('/api/v1/rates', ratesRouter);

app.use((err: unknown, req: Request, res: Response, next: Function) => {
  if (err instanceof DwApplicationError) {
    res.status(err.statusCode);
    res.json({ status: 'error', message: err.message });
  } else {
    logger.error(err);
    res.status(500);
    res.json({ status: 'error', message: 'internal server error' });
  }
  next();
});

app.listen(8000, () => {
  logger.info('Server started.');
});
