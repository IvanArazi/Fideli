import express from 'express';
import { getAllCategories, createCategory, deleteCategory } from '../controllers/categoryController.js';
import { validationAdminToken } from '../middlewares/authAdmin.js';
import uploadCategory from '../middlewares/uploadCategory.js';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', validationAdminToken, uploadCategory.single("image"), createCategory);
router.delete('/:id', validationAdminToken, deleteCategory);

export default router;