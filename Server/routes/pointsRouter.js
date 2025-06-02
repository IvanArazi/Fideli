import express from 'express';
import {getAllPoints, getPointsByUser, getPointsByUserAndBrand, getPointsByBrand, acumulatePoints} from '../controllers/pointController.js';
import { validationTokenBrand } from '../middlewares/authBrand.js';

const router = express.Router();

// Rutas para los puntos
router.get('/', getAllPoints);
router.get('/user/:id', getPointsByUser);
router.get('/brand/:id', getPointsByBrand);
router.get('/user/:user/brand/:brand', getPointsByUserAndBrand);
router.post('/acumulate', validationTokenBrand, acumulatePoints);

export default router;