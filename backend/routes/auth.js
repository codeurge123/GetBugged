import express from 'express';
import { signup, login, logout, updateName } from '../controllers/authController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// local auth
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// protected routes (require authentication)
router.put('/update-name', auth, updateName);

export default router;
