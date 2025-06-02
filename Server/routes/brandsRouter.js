import express from 'express';
import {getAllBrands, getBrandsByCategoryId, createBrand, auth, getBrandsApproved, getBrandsRejected, getBrandsPending} from '../controllers/brandController.js';

const router = express.Router();

// Rutas para las marcas
router.get('/', getAllBrands);
router.get('/pending', getBrandsPending);
router.get('/approved', getBrandsApproved);
router.get('/rejected', getBrandsRejected);
router.get('/categoryId/:id', getBrandsByCategoryId);
router.post('/', createBrand);
router.post('/auth', auth);

export default router;