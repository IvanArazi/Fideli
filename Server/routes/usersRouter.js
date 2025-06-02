import express from 'express';
import {getAllUsers, createUser, auth} from '../controllers/userController.js';
import { validationToken } from '../middlewares/auth.js';

const router = express.Router();

// Rutas para los usuarios
router.get('/', getAllUsers);
router.post('/', createUser);
router.post('/auth', auth);

export default router;