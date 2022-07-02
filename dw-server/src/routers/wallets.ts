import express from 'express';
import { walletsController } from './app';

const router = express.Router();

router.get('/:address/balance', (req, res) => walletsController.getBalance(req, res));
router.get('/:address/is_old', (req, res) => walletsController.getIsOld(req, res));

export default router;
