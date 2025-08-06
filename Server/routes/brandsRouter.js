import express from 'express';
import {getAllBrands, getBrandById, getBrandsByCategoryId, createBrand, auth, getBrandsApproved, getBrandsRejected, getBrandsPending} from '../controllers/brandController.js';
import uploadBrand from '../middlewares/uploadBrand.js';

const router = express.Router();

router.get('/', getAllBrands);
router.get('/pending', getBrandsPending);
router.get('/approved', getBrandsApproved);
router.get('/rejected', getBrandsRejected);
router.get('/categoryId/:id', getBrandsByCategoryId);
router.post('/', uploadBrand.single("profileImage"), createBrand);
router.post('/auth', auth);
router.get('/:id', getBrandById);

export default router;