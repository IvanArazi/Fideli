import express from 'express';
import {deleteUser, approvedBrand, rejectedBrand, deleteBrand} from '../controllers/adminController.js';
import { validationAdminToken } from '../middlewares/authAdmin.js';

const router = express.Router();

// Rutas para el admin
router.delete('/user/:id', validationAdminToken, deleteUser);
router.delete('/brand/:id', validationAdminToken, deleteBrand);
router.put('/brand/approved/:id', validationAdminToken, approvedBrand);
router.put('/brand/rejected/:id', validationAdminToken, rejectedBrand);

export default router;