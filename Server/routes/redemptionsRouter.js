import express from 'express';
import { getAllRedemptions, getAllRedemptionPending, getAllRedemptionUsed, getRedemptionByUser, getRedemptionByBrand, createRedemption, validateRedemption } from '../controllers/redemptionController.js';
import { validationToken } from '../middlewares/auth.js';
import { validationTokenBrand } from '../middlewares/authBrand.js';

const router = express.Router();

// Rutas para los canjes
router.get('/', getAllRedemptions);
router.get('/pending', getAllRedemptionPending);
router.get('/used', getAllRedemptionUsed);
router.get('/user/:userId', getRedemptionByUser);
router.get('/brand/:brandId', getRedemptionByBrand);
router.post('/', validationToken, createRedemption);
router.post('/validation', validationTokenBrand, validateRedemption);

export default router;