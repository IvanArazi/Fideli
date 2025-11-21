import express from 'express';
import {getAllEvents, getAllEventsByBrand, createEvent, getEventById, updateEvent, deleteEvent } from '../controllers/eventController.js';
import {validationTokenBrand} from '../middlewares/authBrand.js';

const router = express.Router();

router.get('/', getAllEvents);
router.get('/brand/:brandId', getAllEventsByBrand);
router.get('/:id', getEventById);
router.post('/', validationTokenBrand, createEvent);
router.put('/:id', validationTokenBrand, updateEvent);
router.delete('/:id', validationTokenBrand, deleteEvent);

export default router;
