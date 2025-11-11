import express from 'express';
import { getAmapKey } from '../controllers/configController.js';

const router = express.Router();

router.get('/amap-key', getAmapKey);

export default router;