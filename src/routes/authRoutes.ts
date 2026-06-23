import { Router } from 'express';
import { loginUser } from '../controller/authController';

const router = Router();

// POST request එකක් හරහා /api/auth/login route එක සෑදීම
router.post('/login', loginUser);

export default router;