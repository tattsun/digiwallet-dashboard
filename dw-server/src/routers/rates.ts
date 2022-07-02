import express from 'express';
import { ratesController } from './app';

const router = express.Router();

router.get('/', (req, res) => ratesController.getRate(req, res));
router.put('/', (req, res) => ratesController.putRate(req, res));

export default router;
