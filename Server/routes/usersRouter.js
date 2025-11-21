import express from 'express';
import {getAllUsers, createUser, auth, getMe, updateMe} from '../controllers/userController.js';
import { validationToken } from '../middlewares/auth.js';
import uploadUser from '../middlewares/uploadUser.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.post('/auth', auth);
router.get('/me', validationToken, getMe);
router.put('/me', validationToken, uploadUser.single("profileImage"), updateMe);

export default router;
