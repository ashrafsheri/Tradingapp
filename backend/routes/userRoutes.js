import express from 'express';
import { login, register,changePassword,getUserInfo } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/change-password',changePassword)
router.get('/:username', getUserInfo);

export default router;
