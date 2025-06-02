import express from 'express';
import {getAllEvents, getAllEventsByBrand, createEvent, getEventById } from '../controllers/eventController.js';
import {validationTokenBrand} from '../middlewares/authBrand.js';

const router = express.Router();

// Rutas para eventos
router.get('/', getAllEvents);
router.get('/brand/:brandId', getAllEventsByBrand);
router.get('/:id', getEventById);
router.post('/', validationTokenBrand, createEvent);

export default router;