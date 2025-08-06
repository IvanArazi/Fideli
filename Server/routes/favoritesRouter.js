import express from 'express';
import { getAllFavorites, getFavoritesByUserId, getFavoritesByBrandId, createFavorite, deleteFavorite } from '../controllers/favoriteController.js';
import { validationToken } from '../middlewares/auth.js';
import { validationTokenBrand } from '../middlewares/authBrand.js';

const router = express.Router();

router.get('/', getAllFavorites);
router.get('/user', validationToken, getFavoritesByUserId);
router.get('/brand', validationTokenBrand, getFavoritesByBrandId);
router.post('/', validationToken, createFavorite);
router.delete('/:id', validationToken, deleteFavorite);

export default router;