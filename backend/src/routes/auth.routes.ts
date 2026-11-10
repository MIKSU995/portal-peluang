// backend/src/routes/auth.routes.ts
import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller';
import { authenticateUser } from '../middlewares/auth.middleware';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', authenticateUser, logout);
router.get('/me', authenticateUser, getMe);

export default router;

