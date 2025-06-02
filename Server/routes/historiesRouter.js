import express from 'express';
import { getAllHistory, getHistoriesByUserId, getHistoriesByBrandId } from '../controllers/historyController.js';

const router = express.Router();

// Rutas del historial
router.get('/', getAllHistory);
router.get('/user/:userId', getHistoriesByUserId);
router.get('/brand/:brandId', getHistoriesByBrandId);

export default router;