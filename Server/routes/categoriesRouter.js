import express from 'express';
import { getAllCategories, createCategory } from '../controllers/categoryController.js';
import { validationAdminToken } from '../middlewares/authAdmin.js';

const router = express.Router();

// Rutas para las categorías
router.get('/', getAllCategories);
router.post('/', validationAdminToken, createCategory);

export default router;