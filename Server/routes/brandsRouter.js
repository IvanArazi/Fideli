import express from 'express';
import {getAllBrands, getBrandById, getBrandsByCategoryId, createBrand, auth, getBrandsApproved, getBrandsRejected, getBrandsPending, getMeBrand, updateMeBrand} from '../controllers/brandController.js';
import uploadBrand from '../middlewares/uploadBrand.js';
import { validationTokenBrand } from '../middlewares/authBrand.js';

const router = express.Router();

router.get('/', getAllBrands);
router.get('/pending', getBrandsPending);
router.get('/approved', getBrandsApproved);
router.get('/rejected', getBrandsRejected);
router.get('/categoryId/:id', getBrandsByCategoryId);
router.post('/', uploadBrand.single("profileImage"), createBrand);
router.post('/auth', auth);
router.get('/me/profile', validationTokenBrand, getMeBrand);
router.put('/me/profile', validationTokenBrand, uploadBrand.single("profileImage"), updateMeBrand);
router.get('/:id', getBrandById);

export default router;
